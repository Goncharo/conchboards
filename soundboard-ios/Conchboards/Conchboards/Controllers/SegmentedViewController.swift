//
//  SegmentedViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-09.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import Nuke
import RxSwift
import SVProgressHUD

class SegmentedViewController: UIViewController, UITableViewDelegate, UITableViewDataSource  {

    let SEGMENT_1 : String = "segment1"
    let SEGMENT_2 : String = "segment2"
    
    var segment1Soundboards = [Soundboard]()
    var segment2Soundboards = [Soundboard]()
    var selectedSoundboard : Soundboard? = nil
    var selectedSoundboardFavourited = false
    var segment1Page : Int = 1
    var segment2Page : Int = 1
    var limit : Int = 5
    var currentSegment : String = ""
    var currentNameSearch : String = ""
    var fetching : Bool = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        currentSegment = SEGMENT_1
        _ = SounboardHelper.soundboardUpdates.subscribe { (event) in
            self.soundboardUpdated(id: (event.element?.0)!, updateType: (event.element?.1)!)
        }
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(2)
        SVProgressHUD.setMaximumDismissTimeInterval(2)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: - Table View Methods
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        tableView.backgroundView = nil;
        if (((currentSegment == SEGMENT_1 && segment1Soundboards.count == 0) ||
            (currentSegment == SEGMENT_2 && segment2Soundboards.count == 0)) && !fetching)
        {
            let rect = CGRect(origin: CGPoint(x: 0,y :0), size: CGSize(width: self.view.bounds.size.width, height: self.view.bounds.size.height))
            let messageLabel = UILabel(frame: rect)
            messageLabel.text = "No soundboards found, swipe up to refresh."
            messageLabel.textColor = UIColor.black
            messageLabel.numberOfLines = 0;
            messageLabel.textAlignment = .center;
            messageLabel.font = UIFont(name: "TrebuchetMS", size: 15)
            messageLabel.sizeToFit()
            
            tableView.backgroundView = messageLabel;

            return 0
        }
        return (currentSegment == SEGMENT_1) ? segment1Soundboards.count : segment2Soundboards.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "soundboardPreviewCell", for: indexPath) as! SoundboardPreviewCell
        let soundboard = (currentSegment == SEGMENT_1) ?segment1Soundboards[indexPath.row] : segment2Soundboards[indexPath.row]
        Manager.shared.loadImage(with: URL(string: soundboard.imageUrl)!, into: cell.soundboardImage)
        cell.nameLabel.text = soundboard.name
        cell.favouritesLabel.text = "\(soundboard.favourites) \u{2665}\u{0000FE0E}"
        cell.createdAtLabel.text = "Created by \(soundboard.creatorUsername) on \(soundboard.createdAt)"
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let soundboard = (currentSegment == SEGMENT_1) ?segment1Soundboards[indexPath.row] : segment2Soundboards[indexPath.row]
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoard(id: soundboard.id){
            success in
            if(success)
            {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
                tableView.deselectRow(at: indexPath, animated: true)
                self.performSegue(withIdentifier: "goToSoundboard", sender: self)
            }
            else
            {
                UIApplication.shared.endIgnoringInteractionEvents()
                tableView.deselectRow(at: indexPath, animated: true)
            }
        }
    }
    
    // MARK: - API Calls
    
    // get all soundboards for currently set segment, page,
    // and name filter
    func fetchBoards(done: @escaping () -> Void) {
        fetching = true
        self.refreshView()
        Alamofire.request(getURL(), method: .get, parameters: getQueryParams(), headers: Authentication.getAuthenticationHeaders()).responseJSON
            {
                response in
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    
                    if json["success"].boolValue {
                        for (_, soundboardJSON) in json["soundboards"] {
                            let newSoundboard = Soundboard(name: soundboardJSON["name"].stringValue, id: soundboardJSON["id"].stringValue, imageUrl: "\(Configuration.API_URL)/static/\(soundboardJSON["image"].stringValue)", favourites: soundboardJSON["favourites"].intValue, creatorId: soundboardJSON["creatorId"].stringValue, creatorUsername: soundboardJSON["creatorUsername"].stringValue, createdAt: SounboardHelper.formatDate(date: soundboardJSON["createdAt"].stringValue))
                            
                            (self.currentSegment == self.SEGMENT_1) ? self.segment1Soundboards.append(newSoundboard) : self.segment2Soundboards.append(newSoundboard)
                        }
                        self.fetching = false
                        self.refreshView()
                    }
                    else {
                        print(json["message"].stringValue)
                        self.fetching = false
                        SVProgressHUD.showError(withStatus: "Error loading soundboards. Please check network connection and try again.")
                    }
                    
                } else {
                    print("error: \(response.result.error as Error?)")
                    self.fetching = false
                    SVProgressHUD.showError(withStatus: "Error loading soundboards. Please check network connection and try again.")
                }
                (self.currentSegment == self.SEGMENT_1) ? (self.segment1Page += 1) : (self.segment2Page += 1)
                done()
        }
    }
    
    // fetch a specific soundboard
    func fetchBoard(id: String, done: @escaping (_ success : Bool) -> Void)
    {
        Alamofire.request("\(Configuration.API_URL)/soundboards/\(id)", method: .get, headers: Authentication.getAuthenticationHeaders()).responseJSON
            {
                response in
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    if json["success"].boolValue {
                        self.selectedSoundboardFavourited = json["favourited"].boolValue
                        var sounds = [SoundItem]()
                        for (_, soundsJSON) in json["soundboard"]["soundFiles"]
                        {
                            let sound = SoundItem(name: soundsJSON["name"].stringValue, soundUrl: "\(Configuration.API_URL)/static/\(soundsJSON["soundFile"].stringValue)")
                            sounds.append(sound)
                        }
                        let soundboard = Soundboard(name: json["soundboard"]["name"].stringValue, id: json["soundboard"]["id"].stringValue, imageUrl: "\(Configuration.API_URL)/static/\(json["soundboard"]["image"].stringValue)", sounds: sounds, creatorId: json["soundboard"]["creatorId"].stringValue, creatorUsername: json["soundboard"]["creatorUsername"].stringValue, createdAt: SounboardHelper.formatDate(date: json["soundboard"]["createdAt"].stringValue))
                        self.selectedSoundboard = soundboard
                        done(true)
                    }
                    else {
                        print(json["message"].stringValue)
                        SVProgressHUD.showError(withStatus: json["message"].stringValue)
                        done(false)
                    }
                    
                } else {
                    print("error: \(response.result.error as Error?)")
                    SVProgressHUD.showError(withStatus: "Error loading soundboard. Please check network connection and try again.")
                    done(false)
                }
                
        }
    }
    
    @objc func reactToUniversalLink()
    {
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoard(id: UniversalLinks.soundboardID!){
            success in
            if(success)
            {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
                UniversalLinks.soundboardID = nil
                self.performSegue(withIdentifier: "goToSoundboard", sender: self)
            }
            else
            {
                UIApplication.shared.endIgnoringInteractionEvents()
                UniversalLinks.soundboardID = nil
            }
        }
    }
    
    // MARK: - Navigation & Delegate Methods
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?){
        
        if segue.identifier == "goToSoundboard" {
            // pass currently selected soundboard to next view
            let destVC = segue.destination as! SoundboardViewController
            //destVC.delegate = self
            destVC.soundboard = selectedSoundboard
            destVC.favourited = selectedSoundboardFavourited
        }
    }
    
    func soundboardUpdated(id: String, updateType: UpdateType) {
        if updateType == .delete {
            handleDelete(id: id)
            refreshView()
        } else if updateType == .favourite {
            handleFavourite(id: id)
            refreshView()
        } else if updateType == .unfavourite {
            handleUnfavourite(id: id)
            refreshView()
        }
    }
    
    func handleDelete(id: String) {
        for (index, board) in segment1Soundboards.enumerated() {
            if board.id == id {
                segment1Soundboards.remove(at: index)
                break
            }
        }
        for (index, board) in segment2Soundboards.enumerated() {
            if board.id == id {
                segment2Soundboards.remove(at: index)
                break
            }
        }
    }
    
    func handleFavourite(id: String) {
        for (index, board) in segment1Soundboards.enumerated() {
            if board.id == id {
                segment1Soundboards[index].favourites += 1
                break
            }
        }
        for (index, board) in segment2Soundboards.enumerated() {
            if board.id == id {
                segment2Soundboards[index].favourites += 1
                break
            }
        }
    }
    
    func handleUnfavourite(id: String) {
        for (index, board) in segment1Soundboards.enumerated() {
            if board.id == id {
                segment1Soundboards[index].favourites -= 1
                break
            }
        }
        for (index, board) in segment2Soundboards.enumerated() {
            if board.id == id {
                segment2Soundboards[index].favourites -= 1
                break
            }
        }
    }
    
    
    func handleSegmentSelected(_ sender: UISegmentedControl) {
        if sender.selectedSegmentIndex == 0 {
            currentSegment = SEGMENT_1
            refreshView()
        } else {
            currentSegment = SEGMENT_2
            if segment2Page == 1 {
                SVProgressHUD.show()
                UIApplication.shared.beginIgnoringInteractionEvents()
                fetchBoards() {
                    SVProgressHUD.dismiss()
                    UIApplication.shared.endIgnoringInteractionEvents()
                }
            } else {
                refreshView()
            }
            
        }
    }
    
    func resetView() {
        if currentSegment == SEGMENT_1 {
            segment1Page = 1
            segment1Soundboards = [Soundboard]()
            refreshView()
        } else {
            segment2Page = 1
            segment2Soundboards = [Soundboard]()
            refreshView()
        }
    }

    // MARK: - Methods to be implemented by children
    
    func refreshView() {
        // do nothing
    }
    
    func getQueryParams() -> [String: String] {
        // do nothing
        return ["":""]
    }
    
    func getURL () -> String {
        // do nothing
        return ""
    }

}
