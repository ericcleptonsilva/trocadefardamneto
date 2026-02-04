import pytest
from playwright.sync_api import Page, expect

def test_exchange_flow(page: Page):
    page.goto("http://127.0.0.1:5000")

    # Fill form
    page.fill("#student_id", "12345")
    page.fill("#uniform_code", "CAMISA-01")
    page.fill("#uniform_size", "M")
    page.fill("#reason", "Tamanho Incorreto")

    # Click register
    # Note: The button type is submit
    page.click("button[type='submit']")

    # Handle alert
    # Playwright automatically dismisses dialogs but we can listen to it if needed.
    # The app uses window.alert, which pauses execution in browser but playwright handles it.

    # Check history table
    # Wait for the row to appear
    page.wait_for_selector("table#historyTable tbody tr")

    rows = page.locator("table#historyTable tbody tr")
    expect(rows.first).to_contain_text("12345")
    expect(rows.first).to_contain_text("CAMISA-01")
    expect(rows.first).to_contain_text("M")
    expect(rows.first).to_contain_text("Tamanho Incorreto")
