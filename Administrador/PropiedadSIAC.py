from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
from selenium.webdriver.support.ui import Select
from faker import Faker
import random

fake = Faker()

temp_id = "10"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--chromedriver_path=C:\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://localhost:1000/principal')

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso1.click()

time.sleep(5)

paso2 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso2.click()

time.sleep(5)

paso3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)

paso3.send_keys("ivanSebastian@gmail.com")

time.sleep(5)

paso4 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'passwordInicio'))
)

paso4.send_keys("0308")

time.sleep(5)

paso5 = driver.find_element(By.XPATH, '/html/body/div/div/form/button')
paso5.click()

time.sleep(5)

paso6 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso6.click()

time.sleep(5)

paso7 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[2]')
paso7.click()

time.sleep(5)

# Generar un lugar aleatorio
random_place = fake.city()

paso8 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'descripcionPropiedad'))
)
paso8.send_keys(random_place)

time.sleep(5)

paso9 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'condomino'))
)

paso9.send_keys("Gael")

time.sleep(5)

# Seleccionar aleatoriamente una opción para tipoPropiedad
random_value = random.choice(["0", "1", "2"])
paso10 = driver.find_element(By.ID, 'tipoPropiedad')
select = Select(paso10)
select.select_by_value(random_value)

time.sleep(5)

paso11 = driver.find_element(By.XPATH, '/html/body/div/div/div[2]/div[1]/div/form/table/tbody/tr[4]/td/button')
paso11.click()

time.sleep(5)

# Seleccionar aleatoriamente una descripción para descripcionPago
random_description = random.choice(["Casa unifamiliar aislada","Casa unifamiliar pareada","Casa unifamiliar adosada","Bungalow,Casa de campo","Solar","urbano","Terreno","rústico","Finca","Apartamento","Estudio","Dúplex","Ático"])
paso12 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'descripcionPago'))
)

paso12.send_keys(random_description)

time.sleep(5)

# Generar un número aleatorio de 3 a 4 dígitos para pago
random_payment = random.randint(100, 9999)
paso13 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'pago'))
)

paso13.send_keys(str(random_payment))

time.sleep(5)

paso14 = driver.find_element(By.XPATH, '/html/body/div/div/div[2]/div[2]/div/form/table/tbody/tr[3]/td/button')
paso14.click()

time.sleep(15)

# Cerrar el navegador
driver.quit()