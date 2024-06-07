from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
from selenium.webdriver.support.ui import Select

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

time.sleep(5)

paso5 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso5.click()

time.sleep(5)

paso6 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso6.click()

time.sleep(5)

paso7 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'asunto'))
)

paso7.send_keys("Residentes Alarmados por Falta de Seguridad y Mantenimiento en Áreas Comunes")

time.sleep(5)

paso8 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'descripcion'))
)

paso8.send_keys("La falta de seguridad y mantenimiento en áreas comunes puede haber creado una oportunidad para robos o actos vandálicos. Los residentes, preocupados por su seguridad, podrían haber expresado sus quejas a la administración del condominio.")

time.sleep(5)

paso9 = driver.find_element(By.ID, 'tipo')
select = Select(paso9)
select.select_by_value("2")

time.sleep(5)

paso10 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'fecha'))
)

paso10.send_keys("22/06/2024")

time.sleep(5)

paso11 = driver.find_element(By.XPATH, '/html/body/div/div[2]/div[3]/form/div/button')
paso11.click()

time.sleep(15)

driver.quit()