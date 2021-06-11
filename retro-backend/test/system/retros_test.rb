require "application_system_test_case"

class RetrosTest < ApplicationSystemTestCase
  setup do
    @retro = retros(:one)
  end

  test "visiting the index" do
    visit retros_url
    assert_selector "h1", text: "Retros"
  end

  test "creating a Retro" do
    visit retros_url
    click_on "New Retro"

    click_on "Create Retro"

    assert_text "Retro was successfully created"
    click_on "Back"
  end

  test "updating a Retro" do
    visit retros_url
    click_on "Edit", match: :first

    click_on "Update Retro"

    assert_text "Retro was successfully updated"
    click_on "Back"
  end

  test "destroying a Retro" do
    visit retros_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Retro was successfully destroyed"
  end
end
