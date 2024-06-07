from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
import time
from selenium.webdriver.support.ui import Select
from faker import Faker
import random

fake = Faker()

def generate_email_with_min_length(domain='gmail.com', min_length=6):
    email = ''
    while len(email) < min_length:
        email = fake.email(domain=domain).split('@')[0]
    return f'{email}@{domain}'

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--chromedriver_path=C:\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
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

time.sleep(5)

paso3 = wait.until(
    EC.presence_of_element_located((By.XPATH, '/html/body/div/div/div[1]/div/table/tbody/tr[2]/td[6]')))
paso3.click()

time.sleep(5)

while True:
    paso4 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'nombre'))
    )
    paso4.send_keys(fake.name())

    time.sleep(5)

    paso5 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
    )
    # Generar un correo electrónico solo con dominio Gmail y al menos 6 caracteres
    paso5.clear()
    paso5.send_keys(generate_email_with_min_length())
    time.sleep(5)

    paso6 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.NAME, 'telefono'))
    )
    # Generar un número de teléfono con exactamente 10 dígitos
    paso6.clear()
    paso6.send_keys(fake.numerify('##########'))
    time.sleep(5)

    paso7 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'passwordEdi'))
    )
    paso7.clear()
    paso7.send_keys("ASDFG1234.")

    time.sleep(5)

    paso8 = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.ID, 'confPassword'))
    )
    paso8.clear()
    paso8.send_keys("ASDFG1234.")

    time.sleep(5)

    paso9 = driver.find_element(By.ID, 'status')
    select = Select(paso9)

    # Seleccionar un estado aleatorio entre 1 y 4
    numero_estado = random.randint(1, 4)
    select.select_by_index(numero_estado)

    time.sleep(5)

    paso10 = wait.until(
        EC.presence_of_element_located((By.XPATH, '/html/body/div/div/div[2]/h2[2]/div/div/form/button')))
    paso10.click()

    time.sleep(10)

    driver.quit()

driver.quit()