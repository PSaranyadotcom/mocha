@P0 @wip
Feature: Security page
    
    Scenario: Security - Update Password
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        And I open 'security' tab in account detail page
        And I update my password
        Then I see a message that the new password was saved
        When I log out
        And I log in with my updated password
        Then I am redirected to correct page after log in
        And I cleanup the new accounts I created

    