//
//  TabBarController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-06-25.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import FontAwesome_swift

class TabBarController: UITabBarController {

    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        if let count = self.tabBar.items?.count {
            for i in 0...(count - 1) {
                var icon = FontAwesome.circle
                switch i {
                case 0:
                    icon = FontAwesome.playCircle
                case 1:
                    icon = FontAwesome.user
                case 2:
                    icon = FontAwesome.plus
                case 3:
                    icon = FontAwesome.cog
                default:
                    return
                }
                self.tabBar.items![i].image = UIImage.fontAwesomeIcon(name: icon, textColor: UIColor.black, size: CGSize(width: 40, height: 40))
                self.tabBar.items![i].selectedImage = UIImage.fontAwesomeIcon(name: icon, textColor: UIColor.black, size: CGSize(width: 40, height: 40))
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    

}
