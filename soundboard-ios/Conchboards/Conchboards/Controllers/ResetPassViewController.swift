//
//  ResetPassViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-09-15.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import SVProgressHUD
import Alamofire
import SwiftyJSON

class ResetPassViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var passwordText: UITextField!
    @IBOutlet weak var confirmPassText: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(2.5)
        SVProgressHUD.setMaximumDismissTimeInterval(2.5)
        
        passwordText.delegate = self
        confirmPassText.delegate = self
    }
    
    @IBAction func passFieldTouched(_ sender: UITextField) {
        passwordText.becomeFirstResponder()
    }
    
    @IBAction func confPassFieldTouched(_ sender: UITextField) {
        confirmPassText.becomeFirstResponder()
    }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        passwordText.resignFirstResponder()
        confirmPassText.resignFirstResponder()
    }

    @IBAction func onResetPass(_ sender: UIButton) {
        guard let password = passwordText.text, password != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter a password.")
            return
        }
        
        if(password.range(of: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,40}$", options: .regularExpression) == nil) {
            SVProgressHUD.showInfo(withStatus: "Password must be alphanumeric and have 8-40 characters.")
            return
        }
        
        guard let confirmPass = confirmPassText.text, confirmPass == password else {
            SVProgressHUD.showInfo(withStatus: "Passwords do not match.")
            return
        }
        
        resetPass()
    }
    
    func resetPass() -> Void {
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        let params: [String:String] = ["password" : passwordText.text!]
        Alamofire.request("\(Configuration.API_URL)/resetpass/\(UniversalLinks.resetPassToken!)", method: .post, parameters: params, encoding: JSONEncoding.default).responseJSON
            {
                response in
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    UniversalLinks.resetPassToken = nil
                    if json["success"].boolValue {
                        SVProgressHUD.showSuccess(withStatus: json["message"].stringValue)
                        self.navigationController?.popToRootViewController(animated: true)
                    }
                    else {
                        SVProgressHUD.showError(withStatus: json["message"].stringValue)
                    }
                    
                } else {
                    SVProgressHUD.showError(withStatus: "Error resetting password. Please check network connection and try again.")
                    print("error: \(response.result.error as Error?)")
                }
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        UniversalLinks.resetPassToken = nil
    }

}
