# see steps from apps/e2e_wdio/test/specs/console-onboarding.coppa.e2e.ts

@wip 
Feature: Platform linking child from child-aware titles

    @wip @P0
    Scenario Outline: Link with child sign up on child-aware product "<game>" "<platform>"
        When I use portal device linking from "<game>" "<platform>"
        And enter my age as a child
        And my parent completes setting up the account
        Then a message indicates linking success
        And my child account is in a complete state   # Permission slug contains expected permissions,  platform has parent account complete PAC=true
        And I cleanup the new accounts I created


        Examples:
            | game         | platform |
            | Artemis      | Steam    |
            | Bluenose     | Epic     |
            | Buildup      | Xbox     |
            | Ghostpepper  | Steam    |
            | Hammer       | PSN      |
            | Inverness    | Steam    |
            | Koala        | Steam    |
            | Peppercorn   | Steam    |


    @wip @P1
    Scenario Outline: Link existing child account to second child-aware product requires another parent approval  "<game>" "<platform>"
        Given an approved child account for buildup
        When I use portal device linking from "<game>" "<platform>"
        And I log in with the existing account
        And my parent completes setting up the account
        Then a message indicates linking success
        And my child account is in a complete state   # Permission slug contains expected permissions,  platform has parent account complete PAC=true
        And I cleanup the new accounts I created
        
        Examples:
            | game         | platform |
            | Artemis      | Steam    |
            | Bluenose     | Epic     |
            | Ghostpepper  | Steam    |
            | Hammer       | PSN      |
            | Inverness    | Steam    |
            | Koala        | Steam    |
            | Peppercorn   | Steam    |

    @wip @P1
    Scenario: Can not link existing child account on Lego title if under Lego age minimum for EU country
        Given an approved 13 year old hammer child account in France that is below the Lego age minimum 
        When I use portal device linking from Artemis Steam
        Then I am not allowed to sign in with my child account

