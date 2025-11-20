@P1
Feature: Account Detail page

    @wip
    Scenario: Update Email
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        And I update my email in account detail page
        And I enter email verification code in dialog
        Then my email should be updated successfully after refreshing the page

    Scenario: Cancel Update Email
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I update my email in account detail page
        And I close the dialog without entering verification code
        Then I should see messages related to update email
        And I cancel updating email
        Then I should not be able to see messages related to update email

    @wip
    Scenario: Verify Resend Verification
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        When I update my email in account detail page
        And I close the dialog without entering verification code
        And I click verify email to resend verification
        Then I should receive another email with verification code
