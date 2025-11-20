@wip @P0
Feature: Console Onboarding coppa

    Scenario: 01 Check buildup parental permission
        When I create a child account via "buildup" with age of 12
        And I have my parent to help me setting up the account
        Then Permission slug should contain "no-vc-real-money-purchasing"
        Then I unlink my "Steam" idp account

    Scenario: 02 Should send correct child email to coppa/send-update-child-permissions request endpoint
        When I create a child account via "buildup" with age of 12
        And I have my parent to help me setting up the account
        When I open portal homepage
        And I request my parent to update my permission
        Then Parent email should be sent correctly
        Then I unlink my "Steam" idp account

    #------------------- Lego User Age up ------------------------#

    Scenario: 03 Age up Lego user to 14 years old in Austria
        When I create a child account via "buildup" with age of 13
        And I have my parent to help me setting up the account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        When I open portal homepage
        And I logout
        When I age up the child account to 14 years old
        And I log in
        Then The copy for aged up lego user should be correct
        When I agree to ToS and PP in age up page
        Then Parental Settings should be appearing in account details page
        And Update email button should be shown in account details page

    Scenario: 04 Age up Lego user to 15 years old in Austria
        When I create a child account via "buildup" with age of 14
        And I have my parent to help me setting up the partial account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        When I open portal homepage
        When I age up the child account to 15 years old
        And I log in
        Then Parental Settings should be appearing in account details page
        And Update email button should be shown in account details page

    Scenario: 05 Age up Lego user to 16 years old in Austria
        When I create a child account via "buildup" with age of 15
        And I have my parent to help me setting up the partial account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        When I open portal homepage
        When I age up the child account to 16 years old
        And I log in
        Then Parental Settings should not be appearing in account details page
        And Update email button should be shown in account details page
    #  Will fail because of Bug ticket DNA2KP-1173

    #---------------------Non Lego User Age up-------------------------------#
    Scenario: 04 Age up non Lego user to 14 years old in Austria
        When I create a child account via "bluenose" with age of 12
        And I have my parent to help me setting up the account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        And I open portal homepage
        And I logout
        And I age up the child account to 14 years old
        And I log in
        Then The copy for aged up non lego user should be correct
        When I agree to ToS and PP in age up page
        Then Parental Settings should not be appearing in account details page
        And Communications tab should be shown
        And Update email button should be shown in account details page

    Scenario: 05 Age up non Lego user to 14 years old in Austria with magic link
        When I create a child account via "bluenose" with age of 12
        And I have my parent to help me setting up the account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        And I open portal homepage
        And I logout
        And I age up the child account to 14 years old
        And I open the age up magic link
        Then The copy for aged up non lego user should be correct
        When I agree to ToS and PP in age up page
        Then Parental Settings should not be appearing in account details page
        And Communications tab should be shown
        And Update email button should be shown in account details page

    Scenario: 06 Age up non Lego user to 18 years old in Austria
        When I create a child account via "bluenose" with age of 12
        And I have my parent to help me setting up the account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        And I open portal homepage
        And I logout
        And I age up the child account to 18 years old
        And I log in
        Then The copy for aged up non lego user should be correct
        When I agree to ToS and PP in age up page
        Then Parental Settings should not be appearing in account details page
        And Communications tab should be shown
        And Update email button should be shown in account details page

    Scenario: 07 Age up non Lego user to 18 years old in Austria with magic link
        When I create a child account via "bluenose" with age of 12
        And I have my parent to help me setting up the account
        Then I unlink my "Steam" idp account
        When I wait for 1000 ms
        And I open portal homepage
        And I logout
        And I age up the child account to 18 years old
        And I open the age up magic link
        Then The copy for aged up non lego user should be correct
        When I agree to ToS and PP in age up page
        Then Parental Settings should not be appearing in account details page
        And Communications tab should be shown
        And Update email button should be shown in account details page