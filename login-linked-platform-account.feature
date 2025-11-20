@P0
Feature: log in linked platform account

  @smoke 
  Scenario Outline: Can see log in popup using linked "<platform>"
    When I open portal homepage
    And I click on Continue With "<platform>"
    Then I should be prompted a "<platform>" log in pop up
    Examples:
        | platform |
        | Nintendo |
        | Apple    |
        | Twitch   |
        | Facebook |
        | Steam    |
        | Twitter  |
        | Epic     |
        | Xbox     |

  @wip @P0
  Scenario Outline: log in with linked "<platform>" platform account
    Given a "<platform>" account linked to a verified full account
    When I open portal homepage
    And I sign in with "<platform>"  
    Then my "<platform>" username should be displayed in connection page
    And Links API should contain "<platform>"
     
    Examples:
        | platform |
        | Nintendo |
        | Apple    |
        | Twitch   |
        | Facebook |
        | Steam    |
        | Twitter  |
        | Epic     |
        | Xbox     |

   @wip @P2
    Scenario: Automatically logged in to platform account if originating from an active session "Xbox"
        Given an XBox account linked to a verified full account
        And an active session on Xbox Live
        When I open portal homepage
        And I click on Continue With "Xbox"
        Then my "<platform>" username should be displayed in connection page
