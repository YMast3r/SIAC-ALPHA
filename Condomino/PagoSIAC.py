from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from PIL import Image
import time
import random


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

paso5= driver.find_element(By.ID, 'dropdownUserAvatarButton')
paso5.click()

time.sleep(5)

paso6= driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[2]')
paso6.click()

time.sleep(5)


paso7= driver.find_element(By.XPATH, '/html/body/div/div/div/table/tbody/tr/td[4]/a')
paso7.click()

time.sleep(5)


paso8 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'recargo'))
)

paso8.send_keys("300")

time.sleep(5)

paso9 = driver.find_element(By.ID, 'mes')
select = Select(paso9)
random_index = random.randint(0, 11)  # Genera un índice aleatorio
select.select_by_index(random_index)

time.sleep(5)

paso10 = driver.find_element(By.ID, 'anio')
select = Select(paso10)
random_index = random.randint(0, 10)  # Genera un índice aleatorio
select.select_by_index(random_index)

time.sleep(5)

# Localizar el elemento de entrada de tipo "file"
paso11 = driver.find_element(By.XPATH, '//*[@id="imagen"]')

# Cargar la imagen
imagen = r"C:\Users\ervin\Downloads\Selenium_SIAC_3.0.1\Condomino\imagenes\modelo-factura-es-puro-750px.png"

paso11.send_keys(imagen)

time.sleep(5)

paso12= driver.find_element(By.XPATH, '/html/body/div[2]/form/button')
paso12.click()

time.sleep(10)

driver.quit()
