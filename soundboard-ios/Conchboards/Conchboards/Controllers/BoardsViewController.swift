//
//  BoardsViewController.swift
//  Conchboards
//
//  Created by Dima Goncharov on 2018-03-30.
//  Copyright © 2018 Conch. All rights reserved.
//

import UIKit
import UIScrollView_InfiniteScroll
import SVProgressHUD

class BoardsViewController: SegmentedViewController {
    
    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var tableView: UITableView!
    var refreshControl = UIRefreshControl()

    let SEGMENT_1_TYPE : String = "hottest"
    let SEGMENT_2_TYPE : String = "newest"
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        searchBar.delegate = self
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
        tableView.refreshControl = refreshControl
        
        tableView.tableFooterView = UIView(frame: .zero)
        
        if UniversalLinks.soundboardID != nil {
            // wait until view appears
        }
        else
        {
            // fetch first page of soundboards
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            fetchBoards() {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
            }
        }
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        if UniversalLinks.soundboardID != nil {
            reactToUniversalLink()
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.tabBarController?.navigationItem.hidesBackButton = true
    }
    
    @objc private func refresh(_ sender: Any) {
        resetView()
        currentNameSearch = ""
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoards() {
            UIApplication.shared.endIgnoringInteractionEvents()
            self.refreshControl.endRefreshing()
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func configureTableView ()
    {
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 230
    }
    
    // MARK: - Segment Control Methods
    @IBAction func segmentSelected(_ sender: UISegmentedControl) {
        handleSegmentSelected(sender)
    }
   
    override func refreshView() {
        tableView.reloadData()
    }
    
    override func getQueryParams() -> [String: String] {
        let page = (currentSegment == SEGMENT_1) ? segment1Page : segment2Page
        let type = (currentSegment == SEGMENT_1) ? SEGMENT_1_TYPE : SEGMENT_2_TYPE
        let params : [String: String] = ["page": "\(page)", "limit": "\(limit)", "type": type, "name": currentNameSearch]
        return params
    }
    
    override func getURL() -> String {
        return Configuration.API_URL + "/soundboards"
    }

}

// MARK: - Search Bar Extension
extension BoardsViewController: UISearchBarDelegate {
    

    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        resetView()
        currentNameSearch = searchBar.text!
        searchBar.resignFirstResponder()
        SVProgressHUD.show()
        UIApplication.shared.beginIgnoringInteractionEvents()
        fetchBoards() {
            SVProgressHUD.dismiss()
            UIApplication.shared.endIgnoringInteractionEvents()
        }
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        if (searchBar.text == "")
        {
            resetView()
            currentNameSearch = ""
            SVProgressHUD.show()
            UIApplication.shared.beginIgnoringInteractionEvents()
            fetchBoards() {
                SVProgressHUD.dismiss()
                UIApplication.shared.endIgnoringInteractionEvents()
            }
            DispatchQueue.main.async {
                searchBar.resignFirstResponder()
            }
            
        }
    }
}




