*** Settings ***
Library    SeleniumLibrary
Library    RequestsLibrary
Library    Collections

*** Variables ***
${BROWSER}    Chrome
${APP_URL}    http://localhost
${API_URL}    http://localhost:3000
${API_BASE_PATH}    /api

*** Test Cases ***
Teste Aceitacao 1: Fluxo Completo de Venda - Selecionar Cliente, Produto e Finalizar
    [Documentation]    Simula o fluxo completo: cliente seleciona produto, adiciona ao carrinho e finaliza venda
    [Setup]    Open Browser    ${APP_URL}    ${BROWSER}
    
    # Passo 1: Acessar página de vendas
    Click Link    Vendas
    Wait Until Page Contains    Criar Nova Venda
    
    # Passo 2: Selecionar cliente
    Click Element    id=cliente_select
    Wait Until Element Is Visible    id=cliente_1
    Click Element    id=cliente_1
    ${cliente_selecionado}=    Get Value    id=cliente_select
    Should Not Be Empty    ${cliente_selecionado}
    
    # Passo 3: Selecionar produto
    Click Element    id=produto_select
    Wait Until Element Is Visible    id=produto_5
    Click Element    id=produto_5
    Input Text    id=quantidade_input    3
    
    # Passo 4: Calcular total
    Click Button    Calcular Total
    Wait Until Page Contains    Total
    ${total}=    Get Text    id=total_venda
    Should Match Regexp    ${total}    R\$\\s+\\d+\\.\\d{2}
    
    # Passo 5: Finalizar venda
    Click Button    Finalizar Venda
    Wait Until Page Contains    Venda realizada com sucesso
    
    [Teardown]    Close Browser

Teste Aceitacao 2: Fluxo de Consulta de Clientes e Filtro
    [Documentation]    Simula navegação pela lista de clientes com filtros
    [Setup]    Open Browser    ${APP_URL}    ${BROWSER}
    
    # Passo 1: Acessar página de clientes
    Click Link    Clientes
    Wait Until Page Contains    Lista de Clientes
    
    # Passo 2: Verificar que há clientes listados
    ${quantidade_clientes}=    Get Element Count    class=cliente_row
    Should Be Greater Than    ${quantidade_clientes}    0
    
    # Passo 3: Usar filtro de busca
    Input Text    id=filtro_cliente    João
    Sleep    1s
    
    # Passo 4: Verificar resultados filtrados
    ${clientes_filtrados}=    Get WebElements    class=cliente_row
    FOR    ${cliente}    IN    @{clientes_filtrados}
        ${nome}=    Get Text    ${cliente}
        Should Contain    ${nome}    João
    END
    
    [Teardown]    Close Browser

*** Keywords ***