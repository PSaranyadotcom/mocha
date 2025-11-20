Feature: Platform linking child BLOCKED from non-child-aware titles

    @wip @P0 
    Scenario Outline: Can not link new child account on non-child-aware product "<product>"
        When I use portal device linking from "<game>" "<platform>"
        Then I am not allowed to sign up as a new child account

        Examples:
            | product |
            | Horizon |


    @wip @P2
    Scenario: Can not link existing child account on non-child-aware product
        Given an approved child account for buildup
        When I use portal device linking from non-child-aware product Horizon
        Then I am not allowed to sign in with my child account



