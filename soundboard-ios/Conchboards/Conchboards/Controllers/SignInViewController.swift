//
//  SignInViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-29.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import SVProgressHUD

class SignInViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var emailText: UITextField!
    @IBOutlet weak var passwordText: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(3)
        SVProgressHUD.setMaximumDismissTimeInterval(3)
        
        emailText.delegate = self
        passwordText.delegate = self
        
        if UniversalLinks.verifyToken != nil || UniversalLinks.resetPassToken != nil {
            // wait till view appears
        }
        else
        {
            // go straight to main page is user is already logged in
            if Authentication.isAuthenticated() {
                self.performSegue(withIdentifier: "goToMain", sender: self)
            }
        }

    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if let verifyToken = UniversalLinks.verifyToken {
            verify(token: verifyToken)
        }
        else if UniversalLinks.resetPassToken != nil {
            self.performSegue(withIdentifier: "goToResetPass", sender: self)
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func emailFieldTouched(_ sender: UITextField) {
        emailText.becomeFirstResponder()
    }
    
    @IBAction func passwordFieldTouched(_ sender: UITextField) {
        passwordText.becomeFirstResponder()
    }
    
    @IBAction func onSignIn(_ sender: UIButton) {
        
        guard let email = emailText.text, email != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter account email.")
            return
        }
        
        guard let password = passwordText.text, password != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter account password.")
            return
        }
        
        let params: [String:String] = ["email": email, "password": password]
        signIn(url: Configuration.API_URL + "/signin", params: params)
        
    }
    
    func verify(token : String)
    {
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        Alamofire.request("\(Configuration.API_URL)/verify/\(token)", method: .get, encoding: JSONEncoding.default).responseJSON
            {
                response in
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
                if response.result.isSuccess {
                    let json : JSON = JSON(response.result.value!)
                    
                    if json["success"].boolValue {
                        SVProgressHUD.showSuccess(withStatus: json["message"].stringValue)
                    }
                    else {
                        SVProgressHUD.showError(withStatus: json["message"].stringValue)
                    }
                    
                } else {
                    SVProgressHUD.showError(withStatus: "Error verifying account. Please check network connection and try again.")
                    print("error: \(response.result.error as Error?)")
                }
                UniversalLinks.verifyToken = nil
        }
    }
    
    func signIn(url: String, params: [String:String]) {
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
                        if Authentication.storeAuth(response: json) {
                            self.performSegue(withIdentifier: "goToMain", sender: self)
                            SVProgressHUD.showSuccess(withStatus: json["message"].stringValue)
                        } else {
                            SVProgressHUD.showError(withStatus: "Error storing authentication. Please try again.")
                        }
                    }
                    else {
                         SVProgressHUD.showError(withStatus: json["message"].stringValue)
                    }
                    
                } else {
                    SVProgressHUD.showError(withStatus: "Error signing in. Please check network connection and try again.")
                    print("error: \(response.result.error as Error?)")
                }
        }
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        emailText.resignFirstResponder()
        passwordText.resignFirstResponder()
        return true
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        emailText.resignFirstResponder()
        passwordText.resignFirstResponder()
    }
    
    
    @IBAction func forgotPassClicked(_ sender: UIButton) {
        self.performSegue(withIdentifier: "goToForgotPass", sender: self)
    }
    

}
