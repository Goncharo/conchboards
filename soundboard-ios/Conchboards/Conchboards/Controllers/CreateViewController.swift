//
//  CreateViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-30.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Nuke
import AVFoundation
import SVProgressHUD
import Alamofire
import StoreKit

class CreateViewController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
    
    let MAX_SOUNDS = 12
    
    var selectedSounds = [(String, String)]()
    var selectedImage = ""
    var selectedSoundboardName = ""
    
    @IBOutlet weak var image: UIImageView!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var addImageButton: UIButton!
    var alert : UIAlertController?
    
    var selectingImage = false
    var selectingSound = false
    var currentSoundName = ""
    var currentSenderTag = 0
    var player : AVPlayer?
    
    let soundDocumentPicker = UIDocumentPickerViewController.init(documentTypes: [AVFileType.mp3.rawValue, AVFileType.wav.rawValue, AVFileType.aiff.rawValue], in: .import)
    
    let imageDocumentPicker = UIDocumentPickerViewController.init(documentTypes: ["public.png","public.jpeg"], in: .import)

    override func viewDidLoad() {
        super.viewDidLoad()
        soundDocumentPicker.delegate = self;
        imageDocumentPicker.delegate = self;
        
        collectionView.delegate = self;
        collectionView.dataSource = self;
        
        addImageButton.layer.cornerRadius = 5
        addImageButton.layer.borderWidth = 1
        addImageButton.layer.borderColor = UIColor.black.cgColor
        
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(1.5)
        SVProgressHUD.setMaximumDismissTimeInterval(1.5)
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.tabBarController?.navigationItem.hidesBackButton = true
        if self.tabBarController?.navigationItem.rightBarButtonItem == nil {
            self.tabBarController?.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Set Name", style: .done, target: self, action: #selector(onSetTitle))
        }
    }
    
    func resetView() {
        self.tabBarController?.navigationItem.rightBarButtonItem = nil
        self.tabBarController?.navigationItem.title = ""
        player?.pause()
        selectedImage = ""
        selectedSounds = []
        selectedSoundboardName = ""
        image.image = nil
        addImageButton.setTitle("Add image!", for: .normal)
        collectionView.reloadData()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        // if the transition isn't animated, the user changed tabs
        if(!animated)
        {
            resetView()
        }
    }
    
    @objc func onSetTitle() {
        alert = UIAlertController(title: "Set Soundboard Name", message: "Enter a name for your soundboard below.", preferredStyle: .alert)
        alert?.addTextField { (soundboardNameText) in
            soundboardNameText.placeholder = "soundboard name"
            soundboardNameText.addTarget(self, action: #selector(self.alertTextFieldDidChange(textField:)), for: .editingChanged)
        }
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
            // do nothing
        }
        let setNameAction = UIAlertAction(title: "Set Name", style: .default) { (action) in
            self.selectedSoundboardName = (self.alert?.textFields![0].text)!
            self.tabBarController?.navigationItem.title = self.selectedSoundboardName
            self.tabBarController?.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Upload", style: .done, target: self, action: #selector(self.onUpload))
        }
        
        alert?.addAction(setNameAction)
        alert?.addAction(cancelAction)
        alert?.actions[0].isEnabled = false
        present(alert!, animated: true, completion: nil)
    }
    
    @objc func onUpload() {
        if (selectedImage == "")
        {
            SVProgressHUD.showInfo(withStatus: "Please add an image to the soundboard!")
            return
        }
        else if (selectedSounds.count == 0)
        {
            SVProgressHUD.showInfo(withStatus: "Please add at least one sound to the soundboard!")
            return
        }
        UIApplication.shared.beginIgnoringInteractionEvents()
        Alamofire.upload(
            multipartFormData: { multipartFormData in
                multipartFormData.append(self.selectedSoundboardName.data(using: .utf8)!, withName: "name")
                for selectedSound in self.selectedSounds {
                    multipartFormData.append(selectedSound.0.data(using: .utf8)!, withName: "soundNames[]")
                }
                for selectedSound in self.selectedSounds {
                    multipartFormData.append(URL(string: selectedSound.1)!, withName: "files[]")
                }
                multipartFormData.append(URL(string: self.selectedImage)!, withName: "files[]")
        },
            to: "\(Configuration.API_URL)/soundboards", method: .post, headers: Authentication.getAuthenticationHeaders(),
        encodingCompletion: { encodingResult in
                switch encodingResult {
                case .success(let upload, _, _):
                    upload.responseJSON { response in
                        SVProgressHUD.dismiss()
                        SVProgressHUD.showSuccess(withStatus: "Successfully uploaded soundboard!")
                        SVProgressHUD.dismiss(withDelay: 1.5, completion: {
                            UIApplication.shared.endIgnoringInteractionEvents()
                            self.tabBarController?.selectedIndex = 1
                            SounboardHelper.soundboardUpdates.onNext(("",.uploaded))
                            SKStoreReviewController.requestReview()
                        })
                    }
                    upload.uploadProgress { progress in
                        SVProgressHUD.showProgress(Float(progress.fractionCompleted), status: "Uploading soundboard")
                        UIApplication.shared.endIgnoringInteractionEvents()
                    }
                case .failure(let encodingError):
                    print(encodingError)
                    SVProgressHUD.showError(withStatus: "Failed to upload soundboard!")
                    UIApplication.shared.endIgnoringInteractionEvents()
                }
        }
        )
    }
    
    @IBAction func onImagePressed(_ sender: UIButton) {
        selectingImage = true
        present(imageDocumentPicker, animated: true, completion: nil)
    }
    
    @IBAction func buttonAction(_ sender: UIButton) {
        currentSenderTag = sender.tag
        player?.pause()
        // if this is the last button, show the add sound
        // alert
        if(currentSenderTag == selectedSounds.count)
        {
            if(selectedSounds.count == MAX_SOUNDS)
            {
                SVProgressHUD.showInfo(withStatus: "Cannot add more than \(MAX_SOUNDS) sounds!")
                return
            }
            alert = UIAlertController(title: "Add New Sound", message: "Enter a sound name and choose a sound file.", preferredStyle: .alert)
            alert?.addTextField { (soundNameText) in
                soundNameText.placeholder = "sound name"
                soundNameText.addTarget(self, action: #selector(self.alertTextFieldDidChange(textField:)), for: .editingChanged)
            }
            let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
                // do nothing
            }
            let chooseSoundFileAction = UIAlertAction(title: "Choose Sound File", style: .default) { (action) in
                self.currentSoundName = (self.alert?.textFields![0].text)!
                self.selectingSound = true
                self.present(self.soundDocumentPicker, animated: true, completion: nil)
            }
        
            alert?.addAction(chooseSoundFileAction)
            alert?.addAction(cancelAction)
            alert?.actions[0].isEnabled = false
            present(alert!, animated: true, completion: nil)
        }
        // otherwise, show the alert allowing the user to
        // play the sound or delete the button
        else
        {
            alert = UIAlertController(title: "Edit Sound", message: "Preview or remove the sound you added.", preferredStyle: .alert)
            let removeAction = UIAlertAction(title: "Remove", style: .destructive) { (action) in
                self.selectedSounds.remove(at: self.currentSenderTag)
                self.collectionView.reloadData()
            }
            let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (action) in
                // do nothing
            }
            let playAction = UIAlertAction(title: "Preview", style: .default) { (action) in
                self.player = AVPlayer(url: URL(string: self.selectedSounds[self.currentSenderTag].1)!)
                self.player?.play()
            }
            alert?.addAction(removeAction)
            alert?.addAction(cancelAction)
            alert?.addAction(playAction)
            present(alert!, animated: true, completion: nil)
        }

    }
    
    @objc func alertTextFieldDidChange(textField : UITextField) {
        alert?.actions[0].isEnabled = ((textField.text?.count)! > 0)
    }
    
    // MARK: - Collection View Methods
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return selectedSounds.count + 1
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "soundCell", for: indexPath) as! SoundCollectionViewCell
        let title = indexPath.item == selectedSounds.count ? "Add sound!" : selectedSounds[indexPath.item].0
        cell.soundButton.setTitle(title, for: .normal)
        cell.soundButton.tag = indexPath.item
        cell.soundButton.layer.cornerRadius = 5
        cell.soundButton.layer.borderWidth = 1
        cell.soundButton.layer.borderColor = UIColor.black.cgColor
        return cell
    }

}

extension CreateViewController: UIDocumentPickerDelegate {
    
    // moves provided file to the tmp directory & returns the new URL
    func moveToTmp(_ url: URL) -> URL {
        // Create file URL to temporary folder
        var tempURL = URL(fileURLWithPath: NSTemporaryDirectory())
        // Apend filename (name+extension) to URL
        tempURL.appendPathComponent(url.lastPathComponent)
        do {
            // If file with same name exists remove it (replace file with new one)
            if FileManager.default.fileExists(atPath: tempURL.path) {
                try FileManager.default.removeItem(atPath: tempURL.path)
            }
            // Move file from app_id-Inbox to tmp/filename
            try FileManager.default.moveItem(atPath: url.path, toPath: tempURL.path)
            return tempURL
        } catch {
            print(error.localizedDescription)
        }
        return tempURL
    }
    
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        let tmpURL = moveToTmp(urls[0])
        if(selectingImage)
        {
            selectedImage = tmpURL.absoluteString
            Manager.shared.loadImage(with: tmpURL, into: image)
            addImageButton.setTitle("", for: .normal)
        }
        else if (selectingSound)
        {
            selectedSounds.append((currentSoundName, tmpURL.absoluteString))
            collectionView.reloadData()
        }

        selectingImage = false
        selectingSound = false
    }
}
