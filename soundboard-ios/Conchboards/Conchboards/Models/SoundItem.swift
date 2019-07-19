//
//  Sound.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-31.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation
class SoundItem {
    
    var name : String
    var soundUrl : String
    // TODO: var to store sound file?
    
    init(name: String, soundUrl: String) {
        self.name = name
        self.soundUrl = soundUrl
    }
}
