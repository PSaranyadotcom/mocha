@new
Feature: Refer a Friend
    
    Scenario: Navigate to RAF area 
    Given a new adult account with email verified
    When I open portal homepage
    And I log in
    Then I am redirected to correct page after log in
    And I navigate to refer a friend area
    Then I should see the raf empty page
   
    Scenario: User checks for "<listType>" campaigns after logging in
    Given a new adult account with email verified
    When I open portal homepage
    And I log in
    Then I am redirected to correct page after log in
    When I navigate to refer a friend area
    Then I should see at least one campaign in the "<listType>" list
    Examples:
            | listType |
            | Active   |     

    Scenario: User checks the timer for active campaigns
    Given a new adult account with email verified
    When I open portal homepage
    And I log in
    Then I am redirected to correct page after log in
    When I navigate to refer a friend area   
    And I should be able to see the time left on any active campaign on the active list
    

    Scenario: User checks the first active/expired campaign details
    Given a new adult account with email verified
    When I open portal homepage
    And I log in
    Then I am redirected to correct page after log in
    When I navigate to refer a friend area   
    And I click on the first campaign available in the "<listType>" list 
    Then I should be redirected to the details page of the selected campaign
    Examples:
            | listType |
            | Active   |
    
    Scenario: User navigates back to the list from active/expired campaign details
    Given a new adult account with email verified
    When I open portal homepage
    And I log in
    Then I am redirected to correct page after log in
    When I navigate to refer a friend area   
    And I click on the first campaign available in the "<listType>" list 
    Then I should be redirected to the details page of the selected campaign
    Then I should be able to go back to the campaign list 
    Examples:
            | listType |
            | Active   |

    #todo Scenarios that are to be implemented when we have the FE
    #Scenario: 06 User invites a friend by email after selecting a campaign
    #Given a new adult account with email verified
    #When I open portal homepage
    #And I log in
    #Then I am redirected to correct page after login
    #When I navigate to refer a friend area   
    #When I click on the first active campaign available in the list
    #And I try to invite a friend by email
    #Then I should see a modal confirming that the email has been sent

    #Scenario: 07 User checks the details of an active campaign that they were invited to
    #Given I am logged in
    #And I navigate to the reffer a friend area
    #And I check for active campaigns with the invited label
    #When I click on the first active campaign available in the list
    #And I try to invite a friend by email
    #Then I should see a modal confirming that the email has been sent

    #Scenario: 08 redeemed rewards should match the number of redeemed invitees
