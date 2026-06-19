*** Settings ***
Library    Collections
Library    String

*** Test Cases ***
Teste Unitario 1: Calcular Desconto Corretamente
    [Documentation]    Verifica se o cálculo de desconto é realizado corretamente
    ${valor_original}=    Set Variable    100
    ${percentual_desconto}=    Set Variable    10
    ${valor_esperado}=    Set Variable    90
    
    ${resultado}=    Calcular Desconto    ${valor_original}    ${percentual_desconto}
    Should Be Equal As Numbers    ${resultado}    ${valor_esperado}

Teste Unitario 2: Validar Email do Cliente
    [Documentation]    Verifica se a validação de email funciona corretamente
    ${email_valido}=    Set Variable    cliente@example.com
    ${email_invalido}=    Set Variable    email_invalido
    
    ${resultado_valido}=    Validar Email    ${email_valido}
    Should Be True    ${resultado_valido}
    
    ${resultado_invalido}=    Validar Email    ${email_invalido}
    Should Not Be True    ${resultado_invalido}

*** Keywords ***
Calcular Desconto
    [Arguments]    ${valor}    ${percentual}
    ${desconto}=    Evaluate    ${valor} * (${percentual} / 100)
    ${valor_final}=    Evaluate    ${valor} - ${desconto}
    RETURN    ${valor_final}

Validar Email
    [Arguments]    ${email}
    ${valido}=    Evaluate    "@" in "${email}" and "." in "${email}"
    RETURN    ${valido}