//
//  Authentication.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-30.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation
import SwiftyJSON
import SwiftKeychainWrapper
import Alamofire

class Authentication {
    
    // stores user authentication information
    static func storeAuth(response : JSON) -> Bool {
        return KeychainWrapper.standard.set(response["jwt"].stringValue, forKey: "jwt")
                && KeychainWrapper.standard.set(response["id"].stringValue, forKey: "id")
                && KeychainWrapper.standard.set(response["tokenValidFor"].doubleValue + NSDate.init(timeIntervalSince1970: 0).timeIntervalSince1970, forKey: "tokenExpiry")
    }
    
    // removed all stored user authentication information
    static func destroyAuth() -> Bool {
        return KeychainWrapper.standard.removeObject(forKey: "jwt")
                && KeychainWrapper.standard.removeObject(forKey: "id")
                && KeychainWrapper.standard.removeObject(forKey: "tokenValidFor")
    }
    
    // ensures the currently stored jwt token is not expired
    static func isAuthenticated() -> Bool {
        guard let jwt = KeychainWrapper.standard.string(forKey: "jwt"), jwt != "" else {
            return false
        }
        guard let id = KeychainWrapper.standard.string(forKey: "id"), id != "" else {
            return false
        }
        guard let tokenExpiry = KeychainWrapper.standard.double(forKey: "tokenExpiry"), tokenExpiry > 0 else {
            return false
        }
        return tokenExpiry > NSDate.init(timeIntervalSince1970: 0).timeIntervalSince1970
    }
    
    // returns headers to be used to authentication
    static func getAuthenticationHeaders() -> HTTPHeaders {
        guard let jwt = KeychainWrapper.standard.string(forKey: "jwt"), jwt != "" else {
            return ["": ""]
        }
        return ["Authorization": "\(jwt)"]
    }
    
    // returns the stored user id
    static func id() -> String {
        var id = ""
        if let keyId = KeychainWrapper.standard.string(forKey: "id"){
            id = keyId
        }
        return id
    }
    
}
