//
//  ChangePasswordTableViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-28.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import SVProgressHUD
import Alamofire
import SwiftyJSON

class ChangePasswordTableViewController: UITableViewController {

    @IBOutlet weak var currentPassText: UITextField!
    @IBOutlet weak var newPassText: UITextField!
    @IBOutlet weak var confPassText: UITextField!
    
    @IBOutlet weak var changePassButton: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.separatorStyle = .none
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(1.5)
        SVProgressHUD.setMaximumDismissTimeInterval(1.5)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func onChangePassword(_ sender: Any) {
        
        guard let currPass = currentPassText.text, currPass != "" else {
            SVProgressHUD.showError(withStatus: "Must specify current password.")
            return
        }
        
        guard let newPass = newPassText.text, newPass != "" else {
            SVProgressHUD.showError(withStatus: "Must specify new password.")
            return
        }
        
        guard let newPassConf = confPassText.text, newPassConf != "" else {
            SVProgressHUD.showError(withStatus: "Must confirm new password.")
            return
        }
        
        if(!validateInput()) {
            return
        }
        else {

            let params: [String:String] = ["password": newPass, "currentPassword": currPass]
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            Alamofire.request("\(Configuration.API_URL)/changepass", method: .post, parameters: params, encoding: JSONEncoding.default, headers: Authentication.getAuthenticationHeaders()).responseJSON
                {
                    response in
                    SVProgressHUD.dismiss()
                    UIApplication.shared.endIgnoringInteractionEvents()
                    if response.result.isSuccess {
                        let json : JSON = JSON(response.result.value!)
                        
                        if json["success"].boolValue {
                            SVProgressHUD.showSuccess(withStatus: json["message"].stringValue)
                            self.navigationController?.popViewController(animated: true)
                        }
                        else {
                            SVProgressHUD.showError(withStatus: json["message"].stringValue)
                        }
                        
                    } else {
                        SVProgressHUD.showError(withStatus: "Error changing password. Please check ")
                        print("error: \(response.result.error as Error?)")
                    }
            }
        }
    }
    
    func validateInput() -> Bool {
        if(newPassText.text?.range(of: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,40}$", options: .regularExpression) == nil) {
            SVProgressHUD.showError(withStatus: "Password must be alphanumeric and have 8-40 characters.")
            return false
        }
        
        if (newPassText.text != confPassText.text) {
            SVProgressHUD.showError(withStatus: "New passwords do not match!")
            return false
        }
        
        return true
    }
}
