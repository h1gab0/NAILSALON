from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Admin Login
        page.goto("http://localhost:5173/admin")
        page.get_by_placeholder("Username").fill("admin")
        page.get_by_placeholder("Password").fill("admin123")
        page.get_by_role("button", name="Login").click()
        expect(page.get_by_role("heading", name="Admin Dashboard")).to_be_visible()

        # 2. Click on the Appointments & Availability tab
        page.get_by_role("button", name="Appointments & Availability").click()

        # Wait for the calendar to be visible
        page.wait_for_selector('div[class*="CalendarGrid"]')

        # Get the HTML of the page
        html = page.content()
        with open("jules-scratch/verification/admin_page.html", "w") as f:
            f.write(html)
        print("Successfully saved admin page HTML.")

    finally:
        context.close()
        browser.close()

with sync_playwright() as p:
    run(p)
