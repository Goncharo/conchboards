//
//  Soundboard.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-31.
//  Copyright © 2018 Conch. All rights reserved.
//

import Foundation
import SwiftyJSON

class Soundboard {
    
    var name: String
    var id: String
    var imageUrl: String
    var sounds: [SoundItem]
    var favourites: Int
    var creatorId: String
    var creatorUsername: String
    var createdAt: String
    
    init(name: String, id: String, imageUrl: String, sounds: [SoundItem] = [SoundItem](), favourites: Int = 0, creatorId: String, creatorUsername:String, createdAt: String) {
        self.name = name
        self.id = id
        self.imageUrl = imageUrl
        self.sounds = sounds
        self.favourites = favourites
        self.creatorId = creatorId
        self.creatorUsername = creatorUsername
        self.createdAt = createdAt
    }
    
}
