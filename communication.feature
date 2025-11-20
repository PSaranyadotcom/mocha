@P1
Feature: Communications page

    Scenario: Users can update language
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I open the Communication page
        And update language to 'Español'
        Then the copy should be translated in spanish
    
    Scenario: Users can turn off newsletter master consent
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I open the Communication page
        And I click update the newsletter button
        When I deselect master consent to receive newsletters
        And I save my communication settings
        Then I should see I no newsletter subscriptions

    Scenario: Users can turn on newsletter master consent
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I open the Communication page
        And I click update the newsletter button
        When I deselect master consent to receive newsletters
        And I save my communication settings
        Then I should see I no newsletter subscriptions
        And I click update the newsletter button
        When I select master consent to receive newsletters
        And I save my communication settings
        Then I should see newsletter subscriptions

    Scenario: Users can turn off individual product newsletter
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I open the Communication page
        And I click update the newsletter button
        When I deselect newsletter subscription for civilization
        And I save my communication settings
        Then I see civilization is unsubscribed