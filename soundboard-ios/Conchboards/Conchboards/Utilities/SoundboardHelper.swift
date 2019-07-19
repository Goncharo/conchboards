//
//  SoundboardHelper.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-04-10.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation
import RxSwift

class SounboardHelper {
    static var soundboardUpdates = PublishSubject<(String,UpdateType)>()
    
    static func formatDate(date: String) -> String
    {
        print(date)
        var theDate = ""
        
        let dateFormatterGet = DateFormatter()
        dateFormatterGet.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSXXXXX"
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        if let dateObj = dateFormatterGet.date(from: date) {
            theDate = dateFormatter.string(from: dateObj)
        }
        
        return theDate
    }
}
