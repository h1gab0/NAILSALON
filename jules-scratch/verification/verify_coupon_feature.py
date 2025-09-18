from playwright.sync_api import Page, expect
import traceback

def test_coupon_feature(page: Page):
    try:
        print("Navigating to the scheduling page...")
        page.goto("http://localhost:5173/schedule")
        print("On scheduling page.")

        # Step 1: Book an appointment to get a coupon
        print("Booking first appointment...")
        page.locator('[data-testid="date-grid"] button').first.click()
        print("Date selected.")
        page.locator('[data-testid="time-grid"] button').first.wait_for()
        page.get_by_role("button", name="10:00").click()
        print("Time selected.")
        page.get_by_placeholder("Your Name").fill("Test User")
        print("Name entered.")
        page.get_by_placeholder("Your Phone Number").fill("1234567890")
        print("Phone number entered.")
        page.get_by_role("button", name="Confirm Appointment").click()
        print("Confirm button clicked.")

        # Step 2: Verify coupon is generated and get the code
        print("Verifying coupon generation...")
        expect(page.get_by_role("heading", name="Your Exclusive Offer!")).to_be_visible(timeout=10000)
        print("Coupon heading visible.")
        coupon_code_element = page.locator("strong")
        expect(coupon_code_element).to_be_visible()
        coupon_code = coupon_code_element.inner_text()
        print(f"Coupon code found: {coupon_code}")
        page.screenshot(path="jules-scratch/verification/coupon_generated.png")
        print("Screenshot 1 taken.")

        # Step 3: Go back to scheduling page to use the coupon
        print("Navigating back to scheduling page...")
        page.goto("http://localhost:5173/schedule")
        print("On scheduling page again.")

        # Step 4: Book another appointment and apply the coupon
        print("Booking second appointment...")
        page.locator('[data-testid="date-grid"] button').first.click()
        print("Date selected.")
        page.locator('[data-testid="time-grid"] button').first.wait_for()
        page.get_by_role("button", name="11:00").click()
        print("Time selected.")
        page.get_by_placeholder("Your Name").fill("Test User 2")
        print("Name entered.")
        page.get_by_placeholder("Your Phone Number").fill("1234567890")
        print("Phone number entered.")
        page.get_by_placeholder("Coupon Code").fill(coupon_code)
        print("Coupon code entered.")

        page.on("dialog", lambda dialog: dialog.accept())
        page.get_by_role("button", name="Apply Coupon").click()
        print("Apply coupon button clicked.")

        # Step 5: Confirm the appointment and verify the discount
        print("Confirming second appointment...")
        page.get_by_role("button", name="Confirm Appointment").click()
        print("Confirm button clicked.")

        expect(page.get_by_text("Discount Applied:")).to_be_visible(timeout=10000)
        print("Discount text visible.")
        page.screenshot(path="jules-scratch/verification/coupon_applied.png")
        print("Screenshot 2 taken.")
        print("Test completed successfully!")

    except Exception as e:
        print("An error occurred during the test:")
        print(traceback.format_exc())

if __name__ == "__main__":
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        test_coupon_feature(page)
        browser.close()
