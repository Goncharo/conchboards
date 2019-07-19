//
//  SoundboardViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-02.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Nuke
import AVFoundation
import Alamofire
import SwiftyJSON
import SVProgressHUD
import FontAwesome_swift

enum UpdateType {
    case favourite
    case unfavourite
    case delete
    case uploaded
}

class SoundboardViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
    
    var soundboard : Soundboard? = nil
    var favourited : Bool = false
    var lastPlayedSoundIndex : Int? = nil
    var player : AVPlayer?
    
    @IBOutlet weak var favouriteButton: UIButton!
    @IBOutlet weak var deleteButton: UIButton!
    @IBOutlet weak var image: UIImageView!
    @IBOutlet weak var createdAtLabel: UILabel!
    
    @IBOutlet weak var shareButton: UIButton!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var reportButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.title = soundboard?.name
        
        Manager.shared.loadImage(with: URL(string: soundboard!.imageUrl)!, into: image)
        
        createdAtLabel.text = "Created by \(soundboard?.creatorUsername ?? "") on \(soundboard?.createdAt ?? "")"
        
        collectionView.delegate = self
        collectionView.dataSource = self
        
        if soundboard?.creatorId != Authentication.id() {
            deleteButton.isHidden = true
        }
        
        if soundboard?.creatorId == Authentication.id() {
            reportButton.isHidden = true
        }
        
        favouriteButton.titleLabel?.font = UIFont.fontAwesome(ofSize: 35)
        let text = favourited ? FontAwesome.heart : FontAwesome.heartO
        favouriteButton.setTitle(String.fontAwesomeIcon(name: text), for: .normal)
        
        deleteButton.titleLabel?.font = UIFont.fontAwesome(ofSize: 35)
        deleteButton.setTitle(String.fontAwesomeIcon(name: .trash), for: .normal)
        
        shareButton.titleLabel?.font = UIFont.fontAwesome(ofSize: 35)
        shareButton.setTitle(String.fontAwesomeIcon(name: .share), for: .normal)
        
        reportButton.titleLabel?.font = UIFont.fontAwesome(ofSize: 35)
        reportButton.setTitle(String.fontAwesomeIcon(name: .flag), for: .normal)
        
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(2)
        SVProgressHUD.setMaximumDismissTimeInterval(2)
        
        NotificationCenter.default.addObserver(self, selector: #selector(donePlaying), name: Notification.Name.AVPlayerItemDidPlayToEndTime, object: nil)
    }
    
    @objc func donePlaying()
    {
        if let index = lastPlayedSoundIndex {
            (collectionView.cellForItem(at: IndexPath(item: index, section: 0)) as! SoundCollectionViewCell).soundButton.hideLoading()
            lastPlayedSoundIndex = nil
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Collection View Methods
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return (soundboard?.sounds.count)!
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "soundCell", for: indexPath) as! SoundCollectionViewCell
        cell.soundButton.setTitle(soundboard?.sounds[indexPath.item].name, for: .normal)
        cell.soundButton.tag = indexPath.item
        cell.soundButton.layer.cornerRadius = 5
        return cell
    }
    
    // MARK: - button handlers
    
    @IBAction func buttonAction(_ sender: LoadingButton) {
        if(lastPlayedSoundIndex == sender.tag)
        {
            lastPlayedSoundIndex = nil
            sender.hideLoading()
            player?.pause()
            
        }
        else if let url = URL(string: (soundboard?.sounds[sender.tag].soundUrl)!) {
            if let index = lastPlayedSoundIndex {
                (collectionView.cellForItem(at: IndexPath(item: index, section: 0)) as! SoundCollectionViewCell).soundButton.hideLoading()
            }
            lastPlayedSoundIndex = sender.tag
            sender.showLoading()
            player = AVPlayer(url: url)
            player?.play()
        }
    }

    @IBAction func favouritePressed(_ sender: UIButton) {
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        favourite() {
            (status, success) in
            SVProgressHUD.dismiss()
            UIApplication.shared.endIgnoringInteractionEvents()
            if success {
                SVProgressHUD.showSuccess(withStatus: status)
            } else {
                SVProgressHUD.showError(withStatus: status)
            }
        }
    }
    
    @IBAction func deletePressed(_ sender: UIButton) {
        let alert = UIAlertController(title: "Delete Board", message: "Are you sure you want to delete the board?", preferredStyle: .alert)
        
        let deleteAction = UIAlertAction(title: "Delete", style: .destructive) { (action) in
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            self.deleteBoard() {
                (status, success) in
                UIApplication.shared.endIgnoringInteractionEvents()
                SVProgressHUD.dismiss()
                if success {
                    SounboardHelper.soundboardUpdates.onNext(((self.soundboard?.id)!, .delete))
                    SVProgressHUD.showSuccess(withStatus: status)
                    self.navigationController?.popViewController(animated: true)
                } else {
                    SVProgressHUD.showError(withStatus: status)
                }
            }
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel)
        alert.addAction(deleteAction)
        alert.addAction(cancelAction)
        present(alert, animated: true, completion: nil)
    }
    
    @IBAction func sharePressed(_ sender: UIButton) {
        let items = [URL(string: "\(Configuration.WEBAPP_URL)/soundboards/\(soundboard?.id ?? "")")!]
        let ac = UIActivityViewController(activityItems: items, applicationActivities: nil)
        ac.popoverPresentationController?.sourceView = self.view
        ac.popoverPresentationController?.sourceRect = sender.frame
        present(ac, animated: true)
    }
    
    @IBAction func reportPressed(_ sender: UIButton) {
        let alert = UIAlertController(title: "Report Board or Block User", message: "Pressing 'Report' will make the board unvisible to you in future searches. Pressing 'Block User' will also block all content from this user.", preferredStyle: .alert)
        
        let reportAction = UIAlertAction(title: "Report", style: .destructive) { (action) in
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            self.report(blockUser: "false") {
                (status, success) in
                UIApplication.shared.endIgnoringInteractionEvents()
                SVProgressHUD.dismiss()
                if success {
                    SVProgressHUD.showSuccess(withStatus: status)
                    self.navigationController?.popViewController(animated: true)
                } else {
                    SVProgressHUD.showError(withStatus: status)
                }
            }
        }
        
        let blockAction = UIAlertAction(title: "Block User", style: .destructive) { (action) in
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            self.report(blockUser: "true") {
                (status, success) in
                UIApplication.shared.endIgnoringInteractionEvents()
                SVProgressHUD.dismiss()
                if success {
                    SVProgressHUD.showSuccess(withStatus: status)
                    self.navigationController?.popViewController(animated: true)
                } else {
                    SVProgressHUD.showError(withStatus: status)
                }
            }
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel)
        alert.addAction(reportAction)
        alert.addAction(blockAction)
        alert.addAction(cancelAction)
        present(alert, animated: true, completion: nil)
    }
    
    func toggleFavourited() {
        favourited = !favourited
        let text = favourited ? FontAwesome.heart : FontAwesome.heartO
        let updateType : UpdateType = favourited ? .favourite : .unfavourite
        favouriteButton.setTitle(String.fontAwesomeIcon(name: text), for: .normal)
        SounboardHelper.soundboardUpdates.onNext(((self.soundboard?.id)!, updateType))
    }
    
    // MARK: - API Calls
    
    func favourite(done: @escaping (String, Bool) -> ()) {
        Alamofire.request("\(Configuration.API_URL)/soundboards/favourite/\(soundboard?.id ?? "")", method: .post, headers: Authentication.getAuthenticationHeaders()).responseJSON
            {
                response in
                var status = ""
                var success = true
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    
                    if json["success"].boolValue {
                        self.toggleFavourited()
                        status = json["message"].stringValue
                    }
                    else {
                        status = json["message"].stringValue
                        success = false
                    }
                    
                } else {
                    print("error: \(response.result.error as Error?)")
                    status = "Error favouriting soundboard. Please check network connection and try again."
                    success = false
                }
                
                done(status, success)
        }
    }
    
    func report(blockUser : String, done: @escaping (String, Bool) -> ()) {
        Alamofire.request("\(Configuration.API_URL)/soundboards/report/\(soundboard?.id ?? "")?blockUser=\(blockUser)", method: .post, headers: Authentication.getAuthenticationHeaders()).responseJSON
            {
                response in
                var status = ""
                var success = true
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    
                    if json["success"].boolValue {
                        status = json["message"].stringValue
                    }
                    else {
                        status = json["message"].stringValue
                        success = false
                    }
                    
                } else {
                    print("error: \(response.result.error as Error?)")
                    status = "Error reporting soundboard. Please check network connection and try again."
                    success = false
                }
                
                done(status, success)
        }
    }
    
    func deleteBoard (done: @escaping (String, Bool) -> ()) {
        Alamofire.request("\(Configuration.API_URL)/soundboards/\(soundboard?.id ?? "")", method: .delete, headers: Authentication.getAuthenticationHeaders()).responseJSON
            {
                response in
                var status = ""
                var success = true
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    
                    if json["success"].boolValue {
                        status = json["message"].stringValue
                    }
                    else {
                        status = json["message"].stringValue
                        success = false
                    }
                    
                } else {
                    print("error: \(response.result.error as Error?)")
                    status = "Error favouriting soundboard. Please check network connection and try again."
                    success = false
                }
                
                done(status, success)
        }
    }
    
}
