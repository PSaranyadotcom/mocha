Feature: Platform linking adult from non-child-aware titles 

    @P0 @wip
    Scenario Outline: Link existing adult account on non-child-aware product "<game>" "<platform>"
        Given a new adult account with email verified
        When I use portal device linking from "<game>" "<platform>"
        And I log in with the existing account
        Then a message indicates linking success

        Examples:
            | game     | platform |
            | Horizon  | Steam    |

    @P0 @wip
    Scenario Outline: Link with adult sign up on non-child-aware product "<game>" "<platform>"
        When I use portal device linking from "<game>" "<platform>"
        And sign up with a new adult account
        And verify the new account
        Then a message indicates linking success

        Examples:
            | game     | platform |
            | Horizon  | Steam    |

    @wip @P2
    Scenario Outline: Can not link to already linked adult account on non-child-aware product "<game>" "<platform>"
        Given an adult account with email verified already linked on "<platform>"
        When I use portal device linking from "<game>" "<platform>"
        And I log in with the existing account
        Then I am told this account is already linked

        Examples:
            | game     | platform |
            | Horizon  | Steam    |


