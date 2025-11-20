Feature: Platform linking adult from child-aware titles 

    @P0 @wip
    Scenario Outline: Link existing adult account from child-aware product "<game>" "<platform>"
        Given a new adult account with email verified
        When I use portal device linking from "<game>" "<platform>"
        And I log in with the existing account
        Then a message indicates linking success
        And I cleanup the new accounts I created

        Examples:
            | game         | platform |
            | Artemis      | Epic     |
            | Bluenose     | Xbox     |
            | Buildup      | PSN      |
            | Ghostpepper  | Steam    |
            | Hammer       | Steam    |
            | Inverness    | Steam    |
            | Koala        | Steam    |
            | Peppercorn   | Steam    |              

    @P0 @wip
    Scenario Outline: Link with adult sign up from child-aware product "<game>" "<platform>"
        When I use portal device linking from "<game>" "<platform>"
        And sign up with a new adult account
        And verify the new account
        Then a message indicates linking success
        And I cleanup the new accounts I created


        Examples:
            | game         | platform |
            | Artemis      | Steam    |
            | Bluenose     | Steam    |
            | Buildup      | Steam    |
            | Ghostpepper  | Steam    |
            | Hammer       | Steam    |
            | Inverness    | Steam    |
            | Koala        | Steam    |
            | Peppercorn   | Steam    |

    @P2 @wip
    Scenario Outline: FULL SWEEP Link existing adult account from child-aware product "<game>" "<platform>"
        Given a new adult account with email verified
        When I use portal device linking from "<game>" "<platform>"
        And I log in with the existing account
        Then a message indicates linking success
        And I cleanup the new accounts I created

        Examples:
            | game         | platform |
            | Artemis      | Xbox     |
            | Artemis      | PS5      |
            | Artemis      | Epic     |
            | Artemis      | Steam    |
            | Bluenose     | Xbox     |
            | Bluenose     | PS5      |
            | Bluenose     | Steam    |
            | Buildup      | PS5      |
            | Buildup      | Steam    |
            | Buildup      | Xbox     |
            | Ghostpepper  | Xbox     |
            | Ghostpepper  | PS5      |
            | Ghostpepper  | Steam    |
            | Ghostpepper  | Epic     |
            | Hammer       | Xbox     |
            | Hammer       | PS5      |
            | Hammer       | Steam    |
            | Inverness    | Xbox     |
            | Inverness    | PS5      |
            | Inverness    | Steam    |
            | Koala        | Xbox     |
            | Koala        | PS5      |
            | Koala        | Steam    |
            | Peppercorn   | Steam    |
        