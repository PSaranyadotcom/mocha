Feature: Platform linking from web

    @wip @P0
    Scenario Outline: Link existing adult account from web "<platform>" log in
        Given a new adult account with email verified
        When I open portal homepage
        And I sign in with "<platform>"
        And log in with existing account
        Then my linked "<platform>" username should be displayed in connection page
        And I cleanup the new accounts I created

        Examples:
            | platform |
            | Steam    |
            | Epic     |
            | Xbox     |
            | Discord  |
            | Nintendo |
            | Apple    |
            | Twitch   |
            | Facebook |
            | Steam    |
            | Twitter  |
            | Meta     |
    # | PSN      |  # PSN log in has recaptcha

    @wip @P0
    Scenario Outline: Link with adult sign up from web "<platform>" log in
        When I open portal homepage
        And I sign in with "<platform>"
        And sign up with a new adult account
        And verify the new account
        Then my linked "<platform>" username should be displayed in connection page
        And I cleanup the new accounts I created

        Examples:
            | platform |
            | Steam    |
            | Epic     |
            | Xbox     |
            | Discord  |
            | Nintendo |
            | Apple    |
            | Twitch   |
            | Facebook |
            | Twitter  |
    # | PSN      |  # PSN log in has recaptcha

    @wip @P2
    Scenario: Should not be able to connect to already linked 2k account - Xbox
        Given a new adult account with email verified linked to Xbox account1
        When I open portal homepage
        And I click on Continue With "Xbox"
        And sign in with xbox account2
        Then I should be redirected to "Xbox" linking page in portal
        When I click on log in button
        And I log in with already linked account1
        Then I should be prompted an error "Try using a different"
        And I cleanup the new accounts I created

    Scenario: Link with adult sign up from web "Meta" log in
        When I open portal homepage
        And I click on Continue With "Meta"
        And I log in with "Meta" idp
        And I click on Create Account button
        And I create an adult account
        And I verify my email
        And I open "Connections" tab in account detail page
        Then my "Meta" username should be displayed in connection page
        When I disconnect platform account with my 2k account
        Then my "Meta" username should no longer be shown in connection page

    Scenario: Sign up from web "Meta" with child dob
        When I open portal homepage
        And I click on Continue With "Meta"
        And I log in with "Meta" idp
        And I click on Create Account button
        And I enter my country and a child date of birth
        And I should be prompted an error of "You do not meet the requirements for an account"

    Scenario: Login with Platform
        Given  a new adult account with email verified
        When I open portal homepage
        And  I click on Continue With "<platform>"
        And I log in with "<platform>" idp
        And  I login as an adult using the platform
        Then I am redirected to correct page after login
        When I open "Connections" tab in account detail page
        Then my "<platform>" username should be displayed in connection page
        When I disconnect platform account with my 2k account
        Then my "<platform>" username should no longer be shown in connection page

        Examples:
            | platform |
            | Meta     |

    Scenario: Sign in with already linked Platform into a 2k adult account
        When I open portal homepage
        Then I sign in with "<platform>" that is not linked to a 2k account
        And I login as an adult using the platform that is linked
        Then I should receive an error message the account is already connected

        Examples:
            | platform |
            | Meta     |

    Scenario: Sign in with a Platform into a 2k child account
        When I open portal homepage
        Then I sign in with "<platform>" that is not linked to a 2k account
        And I login as an child using the platform
        Then I should receive an error message that a child account can only be connected within a game

        Examples:
            | platform |
            | Meta     |
