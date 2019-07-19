//
//  MyBoardsViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-30.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import UIScrollView_InfiniteScroll
import SVProgressHUD

class MyBoardsViewController: SegmentedViewController {
    
    let SEGMENT_1_TYPE : String = "created"
    let SEGMENT_2_TYPE : String = "favourited"
    let refreshControl = UIRefreshControl()
    
    @IBOutlet weak var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        tableView.delegate = self
        tableView.dataSource = self
        configureTableView()
        tableView.register(UINib(nibName: "SoundboardPreviewCell", bundle: nil), forCellReuseIdentifier: "soundboardPreviewCell")
        
        tableView.addInfiniteScroll { (tableView) -> Void in
            // fetch next page of soundboards
            UIApplication.shared.beginIgnoringInteractionEvents()
            self.fetchBoards() {
                UIApplication.shared.endIgnoringInteractionEvents()
                tableView.finishInfiniteScroll()
            }
        }
        
        refreshControl.addTarget(self, action: #selector(refresh(_:)), for: .valueChanged)
        tableView.addSubview(refreshControl)
        
        _ = SounboardHelper.soundboardUpdates.subscribe { (event) in
            self.soundboardUploaded(type: (event.element?.1)!)
        }
        
        // fetch first page of soundboards
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoards() {
            SVProgressHUD.dismiss()
            UIApplication.shared.endIgnoringInteractionEvents()
        }
        
        tableView.tableFooterView = UIView(frame: .zero)
    }
    
    func soundboardUploaded(type: UpdateType) {
//        switch type {
//        case .uploaded:
//            if (currentSegment == SEGMENT_1 ){
//                segment1Page = 1
//                segment1Soundboards = [Soundboard]()
//                SVProgressHUD.show()
//                UIApplication.shared.beginIgnoringInteractionEvents()
//                fetchBoards() {
//                    SVProgressHUD.dismiss()
//                    UIApplication.shared.endIgnoringInteractionEvents()
//                }
//            }
//        default:
//            return
//        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.tabBarController?.navigationItem.hidesBackButton = true
        if (currentSegment == SEGMENT_2 ){
            segment2Page = 1
            segment2Soundboards = [Soundboard]()
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            fetchBoards() {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
            }
        }
    }
    
    @objc private func refresh(_ sender: Any) {
        resetView()
        currentNameSearch = ""
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoards() {
            self.refreshControl.endRefreshing()
            UIApplication.shared.endIgnoringInteractionEvents()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func segmentSelected(_ sender: UISegmentedControl) {
        if sender.selectedSegmentIndex == 1 {
            currentSegment = SEGMENT_2
            segment2Page = 1
            segment2Soundboards = [Soundboard]()
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            fetchBoards() {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
            }
        } else {
            handleSegmentSelected(sender)
        }
    }
    
    func configureTableView ()
    {
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 230
    }
    
    override func refreshView() {
        tableView.reloadData()
    }
    
    override func getQueryParams() -> [String: String] {
        let page = (currentSegment == SEGMENT_1) ? segment1Page : segment2Page
        let type = (currentSegment == SEGMENT_1) ? SEGMENT_1_TYPE : SEGMENT_2_TYPE
        let params : [String: String] = ["page": "\(page)", "limit": "\(limit)", "type": type]
        return params
    }
    
    override func getURL() -> String {
        return Configuration.API_URL + "/mysoundboards"
    }
    
    override func handleUnfavourite(id: String) {
        super.handleUnfavourite(id: id)
        for (index, board) in segment2Soundboards.enumerated() {
            if board.id == id && segment2Soundboards[index].creatorId == Authentication.id(){
                segment2Soundboards.remove(at: index)
                break
            }
        }
    }
    
    override func handleFavourite(id: String) {
        super.handleFavourite(id: id)
        
    }

}
