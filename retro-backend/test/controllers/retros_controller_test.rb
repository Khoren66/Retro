require 'test_helper'

class RetrosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @retro = retros(:one)
  end

  test "should get index" do
    get retros_url
    assert_response :success
  end

  test "should get new" do
    get new_retro_url
    assert_response :success
  end

  test "should create retro" do
    assert_difference('Retro.count') do
      post retros_url, params: { retro: {  } }
    end

    assert_redirected_to retro_url(Retro.last)
  end

  test "should show retro" do
    get retro_url(@retro)
    assert_response :success
  end

  test "should get edit" do
    get edit_retro_url(@retro)
    assert_response :success
  end

  test "should update retro" do
    patch retro_url(@retro), params: { retro: {  } }
    assert_redirected_to retro_url(@retro)
  end

  test "should destroy retro" do
    assert_difference('Retro.count', -1) do
      delete retro_url(@retro)
    end

    assert_redirected_to retros_url
  end
end
