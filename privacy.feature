Feature: Privacy page

    @P1
    Scenario: Privacy - Update Search Visibility
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        When I open 'privacy' tab in account detail page
        And I update my search visibility to 'Off'
        Then search visibility should be updated to 'Off' in privacy tab
        When I update my search visibility to 'On'
        Then search visibility should be updated to 'On' in privacy tab

    @wip @P1
    Scenario: Privacy - Update Block List
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        When I open 'privacy' tab in account detail page
        And I block user 'Zeke#08314'
        Then user 'Zeke#08314' should be shown in my block list
        When I remove user 'Zeke#08314' from my block list
        Then user 'Zeke#08314' should not be shown in my block list