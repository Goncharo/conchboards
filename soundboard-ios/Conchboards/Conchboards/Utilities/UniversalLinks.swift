//
//  UniversalLinks.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-08-22.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation

class UniversalLinks {
    
    static var soundboardID : String?
    static var verifyToken : String?
    static var resetPassToken : String?
    
    static func soundboardIDFromURL(url : URL) -> Void {
        let urlComponents = url.pathComponents
        if(urlComponents.count > 2 && urlComponents[1] == "soundboards")
        {
            soundboardID = urlComponents[2]
        }
    }
    
    static func verifyTokenFromURL(url : URL) -> Void {
        guard let urlComponents = URLComponents(string: url.absoluteString) else { return }
        if(url.pathComponents.count == 2 && url.pathComponents[1] == "verify")
        {
            verifyToken = urlComponents.queryItems?.first(where: { $0.name == "token" })?.value
        }
    }
    
    static func resetPassTokenFromURL(url : URL) -> Void {
        guard let urlComponents = URLComponents(string: url.absoluteString) else { return }
        if(url.pathComponents.count == 2 && url.pathComponents[1] == "resetpass")
        {
            resetPassToken = urlComponents.queryItems?.first(where: { $0.name == "token" })?.value
        }
    }
    
}
