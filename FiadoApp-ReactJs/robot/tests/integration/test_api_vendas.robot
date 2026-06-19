*** Settings ***
Library    Collections
Library    RequestsLibrary
Library    JSON

*** Variables ***
${API_URL}    http://localhost:3000
${API_BASE_PATH}    /api

*** Test Cases ***
Teste Integracao 1: Criar Nova Venda via API
    [Documentation]    Testa a criação de uma venda através da API REST
    Create Session    api_session    ${API_URL}
    
    ${headers}=    Create Dictionary    Content-Type=application/json
    ${dados_venda}=    Create Dictionary
    ...    cliente_id=1
    ...    produto_id=5
    ...    quantidade=3
    ...    valor_unitario=50.00
    
    ${response}=    POST Request    api_session    ${API_BASE_PATH}/vendas    
    ...    json=${dados_venda}    headers=${headers}
    
    Should Be Equal As Integers    ${response.status_code}    201
    ${response_json}=    Set Variable    ${response.json()}
    Should Have Key    ${response_json}    id
    Should Be Equal As Numbers    ${response_json}[quantidade]    3
    
    Delete Session    api_session

Teste Integracao 2: Listar Clientes e Verificar Dados
    [Documentation]    Testa a recuperação de lista de clientes da API
    Create Session    api_session    ${API_URL}
    
    ${response}=    GET Request    api_session    ${API_BASE_PATH}/clientes
    
    Should Be Equal As Integers    ${response.status_code}    200
    ${clientes}=    Set Variable    ${response.json()}
    Should Not Be Empty    ${clientes}
    ${primeiro_cliente}=    Get From List    ${clientes}    0
    Should Have Key    ${primeiro_cliente}    id
    Should Have Key    ${primeiro_cliente}    nome
    Should Have Key    ${primeiro_cliente}    email
    
    Delete Session    api_session

*** Keywords ***
Should Have Key
    [Arguments]    ${dict}    ${key}
    Dictionary Should Contain Key    ${dict}    ${key}