Feature: Connection page linking and unlinking

    @wip @P0
    Scenario Outline: Connect and disconnect platform account: <platform>
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        When I open "Connections" tab in account detail page
        And I connect my 2k account with a "<platform>" account
        Then my "<platform>" username should be displayed in connection page
        When I disconnect platform account with my 2k account
        Then my "<platform>" username should no longer be shown in connection page

        # This is a sampling of platforms for testing from the connection page. The full set of platforms are tested from the platform-linking-web feature
        Examples:
            | platform |
            | Steam    |
            | Xbox     |
            | Meta     |

    @P0
    Scenario: Connecting smerf
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        And I open smerf connecting page
        Then smerf connecting page should be shown correctly
        When I click continue
        Then I should be prompted the smerf linking url

    @P1
    Scenario Outline: Should not be able to connect to an already linked platform account: <platform>
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        When I open "Connections" tab in account detail page
        And I try to connect my 2k account with an already linked "<platform>" account
        Then I should be prompted an error of "account is already linked to another 2K account"
        # Add Xbox back once fixed << TODO Debug Xbox
        Examples:
            | platform |
            | Steam    |

    @wip @P2
    Scenario: Should not be able to connect to a non Xbox microsoft account
        Given a new adult account with email verified
        When I open portal homepage
        And I log in
        Then I am redirected to correct page after log in
        When I open "Connections" tab in account detail page
        And I connect my 2k account with a non Xbox microsoft account
        Then There should be an error of "Something went wrong" in the popup
