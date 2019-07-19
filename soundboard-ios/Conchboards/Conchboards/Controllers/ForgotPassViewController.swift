//
//  ForgotPassViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-18.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import Alamofire
import SwiftyJSON
import SVProgressHUD

class ForgotPassViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var emailText: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(2)
        SVProgressHUD.setMaximumDismissTimeInterval(2)
        emailText.delegate = self
    }

    @IBAction func textFieldTouched(_ sender: UITextField) {
        emailText.becomeFirstResponder()
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        emailText.resignFirstResponder()
        return true
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        emailText.resignFirstResponder()
    }
    
    @IBAction func onSendLink(_ sender: UIButton) {
        
        guard let email = emailText.text, email != "" else {
            SVProgressHUD.showInfo(withStatus: "Please enter account email.")
            return
        }
        
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        let params: [String:String] = ["email": email, "mobile": "true"]
    
        Alamofire.request("\(Configuration.API_URL)/forgotpass", method: .post, parameters: params, encoding: JSONEncoding.default).responseJSON
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
                    
                    SVProgressHUD.showError(withStatus: "Error sending reset link. Please check network connection and try again.")
                    print("error: \(response.result.error as Error?)")
                }
        }
    }
    

}
