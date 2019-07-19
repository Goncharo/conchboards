//
//  SettingsTableViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-28.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import SVProgressHUD

class SettingsTableViewController: UITableViewController {
    
    let CHANGE_PASS_INDEX = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        SVProgressHUD.setDefaultStyle(.dark)
        SVProgressHUD.setMinimumDismissTimeInterval(1)
        SVProgressHUD.setMaximumDismissTimeInterval(1)
        
        tabBarItem.image = UIImage.fontAwesomeIcon(name: .cog, textColor: UIColor.black, size: CGSize(width: 40, height: 40))
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        // account settings seciton
        if(indexPath.section == 0)
        {
            if(indexPath.row == CHANGE_PASS_INDEX)
            {
                performSegue(withIdentifier: "goToChangePass", sender: self)
            }
        }
        // section for signout button
        else if(indexPath.section == 1)
        {
           _ = Authentication.destroyAuth()
            SVProgressHUD.showSuccess(withStatus: "Signed out successfully!")
            self.navigationController?.popToRootViewController(animated: true)
            
            
        }
    }
   


}
