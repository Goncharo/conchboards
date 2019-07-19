//
//  SoundboardPreviewCell.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-31.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit

class SoundboardPreviewCell: UITableViewCell {

    @IBOutlet weak var soundboardImage: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var favouritesLabel: UILabel!
    @IBOutlet weak var createdAtLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
