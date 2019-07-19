//
//  SignUpViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-29.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import SVProgressHUD

class SignUpViewController: UIViewController, UITextFieldDelegate {


    @IBOutlet weak var usernameText: UITextField!
    @IBOutlet weak var emailText: UITextField!
    @IBOutlet weak var passwordText: UITextField!
    @IBOutlet weak var confirmPassText: UITextField!
    
    @IBOutlet weak var termsSwitch: UISwitch!
    @IBOutlet weak var termsTextView: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(2.5)
        SVProgressHUD.setMaximumDismissTimeInterval(2.5)
        
        emailText.delegate = self
        passwordText.delegate = self
        confirmPassText.delegate = self
        
        let attributedString = NSMutableAttributedString(string: "I accept the Terms of Service")
        let url = URL(string: "\(Configuration.WEBAPP_URL)/terms")!
        
        // Set the 'click here' substring to be the link
        attributedString.setAttributes([.link: url], range: NSMakeRange(13, 16))
        
        termsTextView.attributedText = attributedString
        termsTextView.isUserInteractionEnabled = true
        termsTextView.isEditable = false
        
        // Set how links should appear: blue and underlined
        termsTextView.linkTextAttributes = [
            NSAttributedStringKey.foregroundColor.rawValue : UIColor.blue,
            NSAttributedStringKey.underlineStyle.rawValue : NSUnderlineStyle.styleSingle.rawValue
        ]
        
    }
    
    @IBAction func usernameFieldTouched(_ sender: UITextField) {
        usernameText.becomeFirstResponder()
    }
    
    @IBAction func emailFieldTouched(_ sxender: UITextField) {
        emailText.becomeFirstResponder()
    }
    
    @IBAction func passwordFieldTouched(_ sender: UITextField) {
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
        emailText.resignFirstResponder()
        passwordText.resignFirstResponder()
        confirmPassText.resignFirstResponder()
        usernameText.resignFirstResponder()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    @IBAction func onSignUp(_ sender: UIButton) {
        
        guard let username = usernameText.text, username != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter a username.")
            return
        }
        
        if(username.range(of: "^[A-Za-z0-9_]{1,15}$", options: .regularExpression) == nil) {
            SVProgressHUD.showInfo(withStatus: "Username must be a maximum of 15 characters, and can only contain letters, numbers, and an underscore.")
            return
        }
        
        guard let email = emailText.text, email != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter account email.")
            return
        }
        
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
        
        if(!termsSwitch.isOn)
        {
            SVProgressHUD.showInfo(withStatus: "Please toggle the switch to indicate you have read and accepted the Terms of Service.")
            return
        }
        
        let params: [String:String] = ["username" : username, "email": email, "password": password, "mobile": "true"]
        
        self.signUp(url: Configuration.API_URL + "/signup", params: params)
    }
    
    func signUp(url: String, params: [String:String]) {
        SVProgressHUD.setMaximumDismissTimeInterval(3.5)
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        Alamofire.request(url, method: .post, parameters: params, encoding: JSONEncoding.default).responseJSON
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
                        print(json["message"].stringValue)
                    }
                    
                } else {
                    SVProgressHUD.showError(withStatus: "Error signing up. Please check network connection and try again.")
                    print("error: \(response.result.error as Error?)")
                }
        }
    }
    
}
