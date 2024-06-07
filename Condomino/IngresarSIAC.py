from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time

temp_id="10"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument = ("--chromedriver_path=C:\chromedriver-win64\chromedriver-win64\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://localhost:1000/principal')

time.sleep(5)

paso0 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso0.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso1.click()

time.sleep(5)

paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)

paso2.send_keys("GaelGabriel@gmail.com")

time.sleep(5)

paso3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'passwordInicio'))
)

paso3.send_keys("2007")

time.sleep(5)

paso4 = driver.find_element(By.XPATH, '/html/body/div/div/form/button')
paso4.click()

time.sleep(15)

driver.quit()