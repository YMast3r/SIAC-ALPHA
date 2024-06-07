import random
import string
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

temp_id = "10"
chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument("--chromedriver_path=C:\\chromedriver-win64\\chromedriver-win64\\chromedriver.exe")
driver = webdriver.Chrome(options=chrome_options)

driver.get('http://localhost:1000/principal')

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso1.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso1.click()

time.sleep(5)

paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'correo_electronico'))
)
paso2.send_keys("ivanSebastian@gmail.com")

time.sleep(5)

paso3 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, 'passwordInicio'))
)
paso3.send_keys("0308")

time.sleep(5)

paso4 = driver.find_element(By.XPATH, '/html/body/div/div/form/button')
paso4.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownUserAvatarButton"]/img')
paso1.click()

time.sleep(5)

paso1 = driver.find_element(By.XPATH, '//*[@id="dropdownAvatar"]/div/a[1]')
paso1.click()

time.sleep(5)

# Generar un nombre aleatorio
def generate_random_name(length=10):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))

# Generar un correo electrónico aleatorio
def generate_random_email():
    domains = ['gmail.com']
    return generate_random_name() + '@' + random.choice(domains)

# Generar un número de teléfono aleatorio
def generate_random_phone():
    return ''.join(random.choices(string.digits, k=10))

# Generar una contraseña aleatoria


# Navegar a la página
wait = WebDriverWait(driver, 10)
num_iterations = 10

for _ in range(num_iterations):
    random_name = generate_random_name()
    random_email = generate_random_email()
    random_phone = generate_random_phone()


    # Paso 2: Llenar el campo 'nombre' con el nombre aleatorio generado
    paso2 = wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/div/div/div[1]/div/table/tbody/tr[2]/td[6]/a')))
    paso2.click()

    time.sleep(5)
    # Paso 3: Llenar el campo 'correo_electronico' con el correo aleatorio generado
    paso3 = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, 'correo_electronico')))
    paso3.clear()
    paso3.send_keys(random_email)

    time.sleep(5)

    # Paso 4: Llenar el campo 'telefono' con el teléfono aleatorio generado
    paso4 = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.NAME, 'telefono')))
    paso4.clear()
    paso4.send_keys(random_phone)

    time.sleep(5)

    # Paso 5: Llenar el campo 'password' con la contraseña aleatoria generada
    paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'password'))
    )
    paso2.send_keys("A1234567.")


    time.sleep(5)

    paso2 = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.NAME, 'confPassword'))
    )
    paso2.send_keys("A1234567.")

    time.sleep(5)

    # Paso 7: Seleccionar una opción en un menú desplegable
    paso7 = driver.find_element(By.ID, 'status')
    select = Select(paso7)

    # Seleccionar un estado aleatorio entre 1 y 4
    numero_estado = random.randint(1, 4)
    select.select_by_index(numero_estado)

    time.sleep(5)

    # Paso 8: Hacer clic en un botón
    paso8 = wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/div/div/div[2]/h2[2]/div/div/form/button')))
    paso8.click()

    time.sleep(7)
    driver.quit()

# Cerrar el navegador
driver.quit()
