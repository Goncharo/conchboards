//
//  Configuration.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-31.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation

class Configuration {
    
    // URL endpoint for Node server
    static let API_URL = Bundle.main.infoDictionary!["API_URL"] as! String
    
    // URL endpoint for Webapp
    static let WEBAPP_URL = Bundle.main.infoDictionary!["WEBAPP_URL"] as! String
}
