
Feature: log in full account

  @P0 @smoke
  Scenario Outline: Adult log in from <entry>
    Given a new adult account with email verified
    When I log in via '<entry>' as an adult
    Then I am redirected to correct page after log in

    Examples:
      | entry    |
      | launcher |
      | portal   |
      | store    |
  @P1
  Scenario: Set 2kfi cookie when 'keep me log in' is checked
    Given a new adult account with email verified
    When I open portal homepage
    Then 2kfi cookie should not exist
    When I check 'Keep me logged in' checkbox
    And I log in
    Then I am redirected to correct page after log in
    And 2kfi cookie should exist
  
 


