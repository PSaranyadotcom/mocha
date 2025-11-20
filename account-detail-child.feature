Feature: Account Detail page for child account

    @wip @P1 
    Scenario: Should send correct child email to send-update-child-permissions request endpoint
        Given an approved child account for buildup
        When I open portal homepage
        And I request my parent to update my permission
        Then parent email should be sent correctly
