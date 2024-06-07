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
chrome_options.add_argument("--chromedriver_path=C:\chromedriver-win64\chromedriver-win64\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)
wait = WebDriverWait(driver, 10)
driver.get('http://localhost:1000/principal')

time.sleep(5)

pasoin = wait.until(
    EC.presence_of_element_located((By.XPATH, '//*[@id="dropdownUserAvatarButton"]')))
pasoin.click()

time.sleep(5)

pasoin = wait.until(
    EC.presence_of_element_located((By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')))
pasoin.click()

time.sleep(5)

pasoin2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)
pasoin2.send_keys("superAdm@gmail.com")

time.sleep(5)

pasoin3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'passwordInicio'))
)
pasoin3.send_keys("0802")

time.sleep(5)

pasoin4 = wait.until(
    EC.presence_of_element_located((By.XPATH, '/html/body/div/div/form/button')))
pasoin4.click()

time.sleep(5)

paso1 = wait.until(
    EC.presence_of_element_located((By.XPATH, '//*[@id="dropdownUserAvatarButton"]')))
paso1.click()

time.sleep(5)

paso2 = wait.until(
    EC.presence_of_element_located((By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')))
paso2.click()

for _ in range(3):  # Cambia 3 por el número de veces que deseas repetir el proceso
    # Paso 1: Hacer clic en un elemento

    time.sleep(3)

    paso3 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'nombre'))
    )
    paso3.send_keys(fake.name())

    time.sleep(5)

    paso4 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
    )
    # Generar un correo electrónico solo con dominio Gmail
    paso4.send_keys(fake.email(domain='gmail.com'))

    time.sleep(5)

    paso5 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'telefono'))
    )
    # Limitar el número de teléfono a 10 caracteres
    paso5.send_keys(fake.random_number(digits=10))

    time.sleep(5)

    paso6 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'password')))
    paso6.send_keys("A12345678.")

    time.sleep(5)

    paso7 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'confPasswordEdi')))
    paso7.send_keys("A12345678.")

    time.sleep(5)


    # Paso 7: Seleccionar una opción en un menú desplegable
    paso8 = driver.find_element(By.ID, 'status')
    select = Select(paso8)

    # Seleccionar un estado aleatorio entre 1 y 4
    numero_estado = random.randint(1, 4)
    select.select_by_index(numero_estado)

    time.sleep(5)

    paso9 = wait.until(
        EC.presence_of_element_located((By.XPATH, '/html/body/div/div/div[2]/h2[2]/div/div/form/button')))
    paso9.click()

    time.sleep(5)

driver.quit()