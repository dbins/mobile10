		//http://www.javascriptlint.com/online_lint.php
		var codigo_produto  = 0;
		var resultados_busca = 0;
		//Para a carga de arquivos
		var carregar_imagens = "NAO";
		var baixar_imagens = "NAO";
		var arrayImagens = [];
		var arrayEtapas = ["xml_novidades.xml", "xml_vestidos.xml", "xml_saias.xml", "xml_blusas.xml", "xml_casacos.xml", "xml_calcas.xml", "xml_shorts.xml", "xml_busca.xml"];
		var carga_status;
		var carga_porcentagem;
		//Para apenas um arquivo
		var arquivo_conteudo = "";
		var arquivo_nome = "";
		var nome_arquivo_sistema = "";
		var carga_offline_titulo = "";
		var carga_offline_destino = "";
		var carga_offline_destino_imagem = "";
		var sistema_online = "SIM";
		var carga_dados_completa =  0;
		var carga_imagens_completa =  0;
		var carga_completa =  0;
		var tmp_arrayImagens = [];
		 // alert dialog dismissed
		function alertDismissed() {
			// do something
		}
		
		function ContarResultados(){
			resultados_busca++;
		}
		
		//function TrocarCodigo(codigo_informado){
			//alert('codigo informado' + codigo_informado);
			//$.mobile.changePage("#tela10", { transition: "slideup"} );
			//codigo_produto = codigo_informado;
			//jJquery Mobile 1.4 only
			//$.mobile.pageContainer.pagecontainer("change", "#page", { options });
		//}

		function TrocarCodigo(codigo_informado){
			codigo_produto = codigo_informado;
			$.mobile.changePage("#tela_detalhe", { transition: "slideup"} );
		}

		
		function echeck(str) {

			var at="@";
			var dot=".";
			var lat=str.indexOf(at);
			var lstr=str.length;
			var ldot=str.indexOf(dot);
			if (str.indexOf(at)==-1){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
			   //alert("Invalid E-mail ID");
			   return false;
			}

			if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
				//alert("Invalid E-mail ID");
				return false;
			}

			 if (str.indexOf(at,(lat+1))!=-1){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
				//alert("Invalid E-mail ID");
				return false;
			 }

			 if (str.indexOf(dot,(lat+2))==-1){
				//alert("Invalid E-mail ID");
				return false;
			 }
			
			 if (str.indexOf(" ")!=-1){
				//alert("Invalid E-mail ID")/
				return false;
			 }

			 return true;				
		}
		
		document.addEventListener("deviceready", onDeviceReady, false);
		 
		function onDeviceReady() {
			isPhoneGapReady = true;
			// detect for network access
			networkDetection();
			// attach events for online and offline detection
			document.addEventListener("online", onOnline, false);
			document.addEventListener("offline", onOffline, false);
			
			//screen.unlockOrientation();
			//navigator.screenOrientation.set('fullSensor');
			//document.addEventListener("orientationChanged", updateOrientation);
			//document.addEventListener("orientationchange", updateOrientation, true);
			$("a").on("click", function (event) {
			  if(typeof $(this).data('parm') !== "undefined") {
				codigo_produto = $(this).data('parm');
			  }
			  if ($(this).attr('id') !== undefined) {
				var tmp_id = $(this).attr('id');
				codigo_produto = tmp_id;
			 }
			});
			
			if (sistema_online == "NAO"){
				$("#titulo_menu").hide();
				$("#menu_miss").hide();
				$("#menu_miss1").hide();
				$("#menu_miss2").hide();
				$("#menu_miss3").hide();
				$("#menu_miss4").hide();
			} else {
				$("#titulo_menu").show();
				$("#menu_miss").show();
				$("#menu_miss1").show();
				$("#menu_miss2").show();
				$("#menu_miss3").show();
				$("#menu_miss4").show();
			}
			
			VerificarCargaArquivos();
			
		}
		
		function networkDetection() {
			if (isPhoneGapReady) {
				
				
				var states = {};
				states[navigator.connection.UNKNOWN]  = 'Unknown connection';
				states[navigator.connection.ETHERNET] = 'Ethernet connection';
				states[navigator.connection.WIFI]     = 'WiFi connection';
				states[navigator.connection.CELL_2G]  = 'Cell 2G connection';
				states[navigator.connection.CELL_3G]  = 'Cell 3G connection';
				states[navigator.connection.CELL_4G]  = 'Cell 4G connection';
				states[navigator.connection.NONE]     = 'No network connection';
				var tipo_conexao = states[navigator.connection.type];
				
				if (tipo_conexao != 'No network connection') {
					isConnected = true;
				}
				
			}	
		}
		
		function onOnline() {
			isConnected = true;
			sistema_online = "SIM";
			$("#titulo_menu").show();
			$("#menu_miss").show();
			$("#menu_miss1").show();
			$("#menu_miss2").show();
			$("#menu_miss3").show();
			$("#menu_miss4").show();
		}
		function onOffline() {
			isConnected = false;
			sistema_online = "NAO";
			$("#titulo_menu").hide();
			$("#menu_miss").hide();
			$("#menu_miss1").hide();
			$("#menu_miss2").hide();
			$("#menu_miss3").hide();
			$("#menu_miss4").hide();
		}
		//function updateOrientation(e) {
			
		//	switch (e.orientation) {
		//		case 90:
		//			//navigator.screenOrientation.set('landscape');
		//			screen.lockOrientation('landscape');
		//			break;
		//		case -90:
		//			//navigator.screenOrientation.set('landscape');
		//			screen.lockOrientation('landscape');
		//			break;
		//		case 180:
		//			//navigator.screenOrientation.set('portrait');
		//			screen.lockOrientation('portrait');
		//			break;	
		//		case 0:
		//			//navigator.screenOrientation.set('portrait');
		//			screen.lockOrientation('portrait');
		//			break;	
		//	}
		//}
		
		
		
		$(document).on('pageinit', '#noticias', function(){  
			
			//Noticias
			$.ajax({
				type: "GET",
				url: "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://feeds.folha.uol.com.br/mercado/rss091.xml&num=20",
				dataType: "jsonp",
				success: function(data) {
					var conteudo = "";
					$.each(data.responseData.feed.entries, function(key1, val1) {
						//alert(val1.content);
						//val1.title;
						//val1.content;
						//val1.link;
						//publishedDate;
						
						conteudo = conteudo + '<div data-role="collapsible">';
						conteudo = conteudo + '<h3>' + val1.title + '</h3>';
						conteudo = conteudo + '<p>' + val1.content + '</p>';
						conteudo = conteudo + '</div>';
						
					});
					//alert(conteudo);
					$("#content_news").append(conteudo);
					//$("#content_news" ).collapsibleset( "refresh" );
					$('[data-role="main"]').trigger('create');

				}
			});
			
		});	
		
		$(document).on('pageinit', '#faleconosco', function(){  
        $(document).on('click', '#enviar_contato', function() { // catch the form's submit event
		
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#nome_contato').val() == "") {
				mensagem = mensagem + 'Prencha o seu nome\n';
				$('#nome_contato').css(field_tag_css);
				continuar = false;
			}

			if ($('#email_contato').val() == "") {
				mensagem = mensagem +  'Digite o endereco de e-mail\n';
				$('#email_contato').css(field_tag_css);
				continuar = false;
			} else {
				if (echeck($('#email_contato').val())==false){
				mensagem = mensagem + 'Preencha corretamente o endereco de e-mail\n';
				continuar = false;
				}
			}


			if ($('#mensagem_contato').val() == "") {
				mensagem = mensagem + 'Prencha a mensagem que deseja enviar\n';
				$('#mensagem_contato').css(field_tag_css);
				continuar = false;
			}
			
		
			if (continuar){
				// Send data to server through the ajax call
				// action is functionality we want to call and outputJSON is our data
				//formData : $('#check-contato').serialize()
					$.ajax({url: 'http://www.misstrendy.com.br/xml/ajax_contato.php',
						data: {action : 'enviar', nome: $('#nome_contato').val(), email: $('#email_contato').val(), ddd_telefone: '00', numero_telefone: '00000000', mensagem: $('#mensagem_contato').val()},
						type: 'post',                   
						async: 'true',
                        dataType: 'text',
						beforeSend: function() {
							// This callback function will trigger before data is sent
							$.mobile.loading('show', {
								theme: "a",
								text: "Aguarde...",
								textonly: true,
								textVisible: true
							});
													},
						complete: function() {
							// This callback function will trigger on data sent/received complete
							$.mobile.loading('hide'); // This will hide ajax spinner
						},
						success: function (result) {
							
							if(result =="OK") {
								navigator.notification.alert('Obrigado por enviar sua mensagem!', alertDismissed, 'Miss Trendy', 'OK'); 
								$.mobile.changePage("#index");							
							} else {
							    navigator.notification.alert('Erro ao gravar suas informacoes!', alertDismissed, 'Miss Trendy', 'OK'); 
							}
						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'Miss Trendy', 'OK');
						}
					});                   
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'Miss Trendy', 'OK');
				//return false;
			}           
            return false; // cancel original event to prevent form submitting
        });    
		});
		
		$(document).on('pageinit', '#tela1', function(){  
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_novidades.xml", "#main_tela1", "Novidades");
			} else {
				LerXML_Online(2, 0, "#main_tela1", "Novidades");
			}
		});		
			
		$(document).on('pageinit', '#tela2', function(){  
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_vestidos.xml", "#main_tela2", "Vestidos");
			} else {
				LerXML_Online(3, 0, "#main_tela2", "Vestidos!");
			}
			
		});	
		
		$(document).on('pageinit', '#tela3', function(){
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_saias.xml", "#main_tela3", "Saias");
			} else {			
				LerXML_Online(4, 0, "#main_tela3", "Saias!");
			}
		});	
		
		$(document).on('pageinit', '#tela4', function(){  
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_blusas.xml", "#main_tela4", "Blusas");
			} else {	
				LerXML_Online(5, 0, "#main_tela4", "Blusas!");
			}	
		});	
		
		$(document).on('pageinit', '#tela5', function(){ 
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_casacos.xml", "#main_tela5", "Casacos");
			} else {			
				LerXML_Online(6, 0, "#main_tela5", "Casacos!");
			}	
		});
		
		$(document).on('pageinit', '#tela6', function(){  
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_calcas.xml", "#main_tela6", "Calcas");
			} else {
				LerXML_Online(7, 0, "#main_tela6", "Calcas!");
			}
		});

		$(document).on('pageinit', '#tela7', function(){  
			if (sistema_online == "NAO"){
				if (carga_dados_completa == 0) {
					navigator.notification.alert('Nao existe conexao com a Internet. Se deseja acessar o catalogo offline, voce precisa primeiro baixar os arquivos quando a conexao estiver disponivel', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("#index");
				}
			}
			
			if (sistema_online == "NAO"){
				LerArquivo_dados("xml_shorts.xml", "#main_tela7", "Shorts");
			} else {
				LerXML_Online(8, 0, "#main_tela7", "Shorts!");
			}
		});

		
		$(document).on('pageinit', '#tela10', function(){ 
			//alert('teste tela10');
			//alert("codigo tela10:" + codigo_produto);
			//Para nao travar o webservice
			//if(isNaN(codigo_produto)){
			//	codigo_produto = 0;
			//}
			
			//if ($(this).data("url") !== undefined){
				var parameters = $(this).data("url").split("?")[1];
				var parameter = parameters.replace("codigo=","");
				codigo_produto = parameter;
			//}
			
			//codigo_produto = parameter;
			//Produto Selecionado
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos_detalhe.php?codigo=" + codigo_produto,
				dataType: "xml",
				success: function(data) {
					var conteudo = '<header class="titulos"><span style="color:#333">Detalhes do </span>produto</header>';
					$(data).find('produto').each(function(){
						var codigo = $(this).find("pro_cod").text();
						var imagem = $(this).find("pro_imagem").text();
						var nome = $(this).find("pro_descricao").text();
						var valor = $(this).find("pro_valor").text();
						var valor_promo = $(this).find("pro_valor_promocao").text();
						var detalhes = $(this).find("pro_espec").text();
						var tamanho = $(this).find("pro_tamanho").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
					
						
						conteudo = conteudo + '<section class="prodtotal">';    
						conteudo = conteudo + '<div id="imgprod"><img src="' + imagem + '" class="img"></a></div>';
						conteudo = conteudo + '</section>';
						conteudo = conteudo + '<div class="buyprod">';
						conteudo = conteudo + '	<header class="titprod">' + nome + '</header>';
						if (valor_promo == ""){
							conteudo = conteudo + '	<div class="valor"> Valor: <span style="color:#e86c6e">R$ ' + valor + '</span></div>';
						} else {
							conteudo = conteudo + '	<div class="produtos-preco">';
							conteudo = conteudo + '<span class="preco-promo">De: R$ ' + valor + '</span>';
							conteudo = conteudo + '<br>Por: R$ ' + valor_promo + '</div>';
							conteudo = conteudo + '</div>';
						}
						conteudo = conteudo + '<div id="descricao">';
						conteudo = conteudo + '	<div class="titulos"><span style="color:#333">Detalhes</span></div>';
						conteudo = conteudo + '	<div class="descprod">';
						conteudo = conteudo + '		<p>' + detalhes + '</p>';
						conteudo = conteudo + '		<p><strong>Tamanho:' + tamanho + '</strong></p>';
						
						//conteudo = conteudo + '<p></p>';
						//conteudo = conteudo + '<p><a href="comprar.html?produto=' + codigo + '" data-role="button">Fazer Pedido</a></p>';
						
						conteudo = conteudo + '	</div>';
						conteudo = conteudo + '</div>';
									
					});
				
					$("#main_tela10").html(conteudo);

				},
				error: function (request,error) {
					// This callback function will trigger on unsuccessful action                
					navigator.notification.alert('Houve um erro ao buscar as informações deste produto!', alertDismissed, 'Miss Trendy', 'OK');
				}
			});
		});	
		
		
		$(document).on('pageshow', '#tela_detalhe', function(){ 
			//Produto Selecionado
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos_detalhe.php?codigo=" + codigo_produto,
				dataType: "xml",
				success: function(data) {
					var conteudo = '<header class="titulos"><span style="color:#333">Detalhes do </span>produto</header>';
					$(data).find('produto').each(function(){
						var codigo = $(this).find("pro_cod").text();
						var imagem = $(this).find("pro_imagem").text();
						var nome = $(this).find("pro_descricao").text();
						var valor = $(this).find("pro_valor").text();
						var valor_promo = $(this).find("pro_valor_promocao").text();
						var detalhes = $(this).find("pro_espec").text();
						var tamanho = $(this).find("pro_tamanho").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
					
						
						conteudo = conteudo + '<section class="prodtotal">';    
						conteudo = conteudo + '<div id="imgprod"><img src="' + imagem + '" class="img"></a></div>';
						conteudo = conteudo + '</section>';
						conteudo = conteudo + '<div class="buyprod">';
						conteudo = conteudo + '	<header class="titprod">' + nome + '</header>';
						if (valor_promo == ""){
							conteudo = conteudo + '	<div class="valor"> Valor: <span style="color:#e86c6e">R$ ' + valor + '</span></div>';
						} else {
							conteudo = conteudo + '	<div class="produtos-preco">';
							conteudo = conteudo + '<span class="preco-promo">De: R$ ' + valor + '</span>';
							conteudo = conteudo + '<br>Por: R$ ' + valor_promo + '</div>';
							conteudo = conteudo + '</div>';
						}
						conteudo = conteudo + '<div id="descricao">';
						conteudo = conteudo + '	<div class="titulos"><span style="color:#333">Detalhes</span></div>';
						conteudo = conteudo + '	<div class="descprod">';
						conteudo = conteudo + '		<p>' + detalhes + '</p>';
						conteudo = conteudo + '		<p><strong>Tamanho:' + tamanho + '</strong></p>';
						
						//conteudo = conteudo + '<p></p>';
						//conteudo = conteudo + '<p><a href="comprar.html?produto=' + codigo + '" data-role="button">Fazer Pedido</a></p>';
						
						conteudo = conteudo + '	</div>';
						conteudo = conteudo + '</div>';
									
					});
				
					$("#main_tela_detalhe").html(conteudo);

				},
				error: function (request,error) {
					// This callback function will trigger on unsuccessful action                
					navigator.notification.alert('Houve um erro ao buscar as informações deste produto!', alertDismissed, 'Miss Trendy', 'OK');
				}
			});
		});	

		$(document).on('pageinit', '#tela11_B', function(){
        $(document).on('click', '#enviar_busca', function() { 
			var field_tag_css = {
				"background-color": "#FFFF99"
			  };
			
			var continuar = true;
			var busca = "";
			var mensagem ="Ocorreram os seguintes erros:\n";
			
			if ($('#nome_produto').val() == "") {
				mensagem = mensagem + 'Informe os dados que deseja localizar\n';
				$('#nome_produto').css(field_tag_css);
				continuar = false;
			} else {
				busca = $('#nome_produto').val();
			}
			
			if (continuar){
				$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos_busca.php?busca=" + busca,
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Resultados da busca!</h2>";
					conteudo = conteudo + '<div class="elements">';
					$(data).find('produtos').each(function(){
						ContarResultados();
						var codigo = $(this).find("pro_cod").text();
						var imagem = $(this).find("pro_imagem").text();
						var nome = $(this).find("pro_descricao").text();
						var valor = $(this).find("pro_valor").text();
						var valor_promo = $(this).find("pro_valor_promocao").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
					
						conteudo = conteudo + '<div class="produtos">';
						conteudo = conteudo + '<div class="produtos-images">';
						conteudo = conteudo + '	<a id = "' + codigo + '" data-parm="' + codigo + '" href="tela10.html?codigo='+ codigo +'"><img src="' + imagem + '" width="200" height="200" class="img"></a>';		
						conteudo = conteudo + '</div>';
						conteudo = conteudo + '<div class="produtos-tit">' + nome + '</div>';
						if (valor_promo == ""){
							conteudo = conteudo + '<div class="valor"> Valor: R$ ' + valor + '</span></div>';
						} else {
							conteudo = conteudo + '<div class="produtos-preco">';
							conteudo = conteudo + '	<span class="preco-promo">De: R$ ' + valor + '</span>';
							conteudo = conteudo + '	<br>';
							conteudo = conteudo + '	Por: R$ ' + valor_promo;   
							conteudo = conteudo + '</div>';
						}
						conteudo = conteudo + '</div>';
					});
					if (resultados_busca ==0){
						conteudo = conteudo + '<p>Não foram localizados produtos.</p>';
					}
					conteudo = conteudo + '</div>';
					$("#main_tela11_B").html(conteudo);

				}
			});
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'Miss Trendy', 'OK');
				//return false;
			}        
		});	
		});	
		
		$(document).on('pageshow', '#comprar', function(){ 
			var parameters = $(this).data("url").split("?")[1];
			var parameter = parameters.replace("produto=","");
			codigo_produto = parameter;
			$.ajax({url: 'http://www.misstrendy.com.br/xml/ajax_carrinho_comprar.php',
			data: {id_prod : codigo_produto, CPF: '44444444444'},
			type: 'post',                   
			async: 'true',
            dataType: 'text',
			beforeSend: function() {
			// This callback function will trigger before data is sent
			$.mobile.loading('show', {
				theme: "a",
				text: "Aguarde...",
				textonly: true,
				textVisible: true
			});
			},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				if(result =="ERRO") {
					navigator.notification.alert('Houve um erro ao adicionar o produto!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("index.html");
				}
				if(result =="JA EXISTE") {
					navigator.notification.alert('O produto já foi adicionado ao seu pedido!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("index.html");
				}	
				if(result =="SEM ESTOQUE") {
					navigator.notification.alert('O produto não está mais disponível em nosso estoque!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("index.html");
				}
				if(result =="OK") {
					navigator.notification.alert('O produto foi adicionado ao seu pedido!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}				
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'Miss Trendy', 'OK');
			}
			});
			
		});	

		$(document).on('pageshow', '#remover', function(){ 
			var parameters = $(this).data("url").split("?")[1];
			var parameter = parameters.replace("id=","");
			var codigo_id = parameter;
			$.ajax({url: 'http://www.misstrendy.com.br/xml/ajax_carrinho_remover.php',
			data: {id : codigo_id},
			type: 'post',                   
			async: 'true',
            dataType: 'text',
			beforeSend: function() {
			// This callback function will trigger before data is sent
			$.mobile.loading('show', {
				theme: "a",
				text: "Aguarde...",
				textonly: true,
				textVisible: true
			});
			},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				if(result =="ERRO") {
					navigator.notification.alert('O produto já havia sido removido do seu pedido!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}
				if(result =="OK") {
					navigator.notification.alert('O produto foi removido do seu pedido!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}				
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'Miss Trendy', 'OK');
			}
			});
			
		});			
		
		
		$(document).on('pageshow', '#alterar', function(){ 
			
			var s = $(this).data("url");
			var idPart = s.split("&")[0];
			var prodPart = s.split("&")[1];
			var qtdePart = s.split("&")[2];
			var codigo_id = idPart.split("=")[1];
			var var_pro_cod = prodPart.split("=")[1];
			var var_qtde = qtdePart.split("=")[1];

			$.ajax({url: 'http://www.misstrendy.com.br/xml/ajax_carrinho_alterar.php',
			data: {id : codigo_id, pro_cod : var_pro_cod, qtde: var_qtde},
			type: 'post',                   
			async: 'true',
            dataType: 'text',
			beforeSend: function() {
			// This callback function will trigger before data is sent
			$.mobile.loading('show', {
				theme: "a",
				text: "Aguarde...",
				textonly: true,
				textVisible: true
			});
			},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				if(result =="ERRO") {
					navigator.notification.alert('Houve um erro ao atualizar a quantidade!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}
				if(result =="SEM ESTOQUE") {
					navigator.notification.alert('O produto não está mais disponível em estoque!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}
				if(result =="OK") {
					$.mobile.changePage("carrinho.html");
				}				
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'Miss Trendy', 'OK');
			}
			});
			
		});	
		
		$(document).on('pageshow', '#finalizar', function(){ 
			
			var parameters = $(this).data("url").split("?")[1];
			var parameter = parameters.replace("CPF=","");
			var var_CPF = parameter;
			
			$.ajax({url: 'http://www.misstrendy.com.br/xml/ajax_finaliza_pedido.php',
			data: {CPF : var_CPF},
			type: 'post',                   
			async: 'true',
            dataType: 'text',
			beforeSend: function() {
			// This callback function will trigger before data is sent
			$.mobile.loading('show', {
				theme: "a",
				text: "Aguarde...",
				textonly: true,
				textVisible: true
			});
			},
			complete: function() {
				// This callback function will trigger on data sent/received complete
				$.mobile.loading('hide'); // This will hide ajax spinner
			},
			success: function (result) {
				if(result =="ERRO") {
					navigator.notification.alert('Não existem mais produtos em seu pedido!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}
				if(result =="SEM ESTOQUE") {
					navigator.notification.alert('Um dos produtos selecionados não está mais disponível em estoque!', alertDismissed, 'Miss Trendy', 'OK'); 
					$.mobile.changePage("carrinho.html");
				}
				if(result =="OK") {
					navigator.notification.alert('Pedido de compra gravado com sucesso!', alertDismissed, 'Miss Trendy', 'OK');
					$.mobile.changePage("index.html");
				}				
			},
			error: function (request,error) {
				// This callback function will trigger on unsuccessful action                
				navigator.notification.alert('Houve um erro ao enviar suas informações!', alertDismissed, 'Miss Trendy', 'OK');
			}
			});
			
		});	
		
		
		$(document).on('pageshow', '#carrinho', function(){ 
		
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_carrinho.php?CPF=44444444444",
				dataType: "xml",
				success: function(data) {
					
					var conteudo = '<header class="titulos"><span style="color:#333">Meu Pedido</header>';
					
					conteudo = conteudo + '<table width="100%" border="0" class="tabela">';
					conteudo = conteudo + '<tr bgcolor="#f6c401" height="37">';
					conteudo = conteudo + '<th width="8%" >Excluir</th>';
					conteudo = conteudo + '<th width="42%">Produto</th>';
					conteudo = conteudo + '<th width="15%">Qtd</th>';
					conteudo = conteudo + '<th width="15%">[+] [-]</th>';
					conteudo = conteudo + '<th width = "15%">Valor</th>';
					conteudo = conteudo + '<th width="15%">Total</th>';
					conteudo = conteudo + '</tr>';
	
					
					var tmp_contador = $(data).find('produtos').length;
					$(data).find('produtos').each(function(){
						//tmp_contador++;
						var codigo = $(this).find("pro_cod").text();
						var imagem = $(this).find("pro_imagem").text();
						var nome = $(this).find("pro_descricao").text();
						var valor = $(this).find("pro_valor").text();
						var quantidade = $(this).find("quantidade").text();
						var total = $(this).find("total").text();
						var id_carrinho = $(this).find("id_carrinho").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
						
						conteudo = conteudo + '<tr>';
						conteudo = conteudo + '<td><a href="remover.html?id=' + id_carrinho + '">Excluir</a></td>';
						conteudo = conteudo + '<td>' + nome + '</td>';
						conteudo = conteudo + '<td>' + quantidade + '</td>';
						conteudo = conteudo + '<td>';
						
						var tmp_qtde1 = Math.abs(quantidade) + 1;
						var tmp_qtde2 = Math.abs(quantidade) - 1;
						
						conteudo = conteudo + '<a href="alterar.html?id=' + id_carrinho + '&pro_cod=' + codigo + '&qtde=' + tmp_qtde1 + '"> [ + ] </a> ';
						
						if (Math.abs(quantidade) > 1){
						
						conteudo = conteudo + '<a href="alterar.html?id=' + id_carrinho + '&pro_cod=' + codigo + '&qtde=' + tmp_qtde2 + '"> [ - ] </a> ';
						
						}
						
						
						
						conteudo = conteudo + '</td>';
						conteudo = conteudo + '<td>' + valor + '</td>';
						conteudo = conteudo + '<td>' + total + '</td>';
						conteudo = conteudo + '</tr>';
						
					});
					if (tmp_contador == 0){
						conteudo = conteudo + '<tr><td colspan="5" align="center">Não existem produtos selecionados</td></tr>';
					}
					conteudo = conteudo + '</table>';
					conteudo = conteudo + '<p></p>';
					if (Math.abs(tmp_contador) > 0){
						conteudo = conteudo + '<p><a href="finalizar.html?CPF=44444444444" data-role="button">Finalizar Pedido</a></p>';
					}
					
					$("#main_carrinho").html(conteudo);

				},
				error: function (request,error) {
					// This callback function will trigger on unsuccessful action                
					navigator.notification.alert('Houve um erro ao buscar as informações do seu pedido!', alertDismissed, 'Miss Trendy', 'OK');
				}
			});
		});	
		
		
		$(document).on('pageshow', '#banner', function(){
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_banners.php",
				dataType: "xml",
				success: function(data) {
					var conteudo = "";
					$(data).find('banners').each(function(){
						var link = $(this).find("link").text();
						var imagem = $(this).find("imagem").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
						
						conteudo = conteudo + '<div class="item">';
                        if (link != "") {
							conteudo = conteudo + '<a href="http://www.misstrendy.com.br/' + link + '">';
                        }
                       
                        conteudo = conteudo + '<img src="' + imagem + '">';
					    if (link != "") {
						    conteudo = conteudo + '</a>';
                        }
					});
					
					$("#owl-demo").html(conteudo);
					$('[data-role="main"]').trigger('create');
					
					$("#owl-demo").owlCarousel({

						navigation : true,
						slideSpeed : 300,
						paginationSpeed : 600,
						singleItem : true,
						autoPlay: true,
						lazyLoad : true,
						transitionStyle : "backSlide",
						itemsMobile : true,
						itemsDesktopSmall : true
					});
				},
				error: function (request,error) {
					// This callback function will trigger on unsuccessful action                
					navigator.notification.alert('Houve um erro ao buscar os banners no sistema!', alertDismissed, 'Miss Trendy', 'OK');
				}
			});
		});
		
		$(document).on('pageshow', '#tela11', function(){
			//$("#searchField").autocomplete({
			//	target: $('#suggestions'),
			//	source: 'http://www.misstrendy.com.br/xml/json_produtos_busca.php',
			//	link: 'tela10.html?codigo=',
			//	minLength: 3
			//});
			
			$("#searchField").autocomplete({
				icon: 'arrow-r',
				target: $('#suggestions'),
				source: 'http://www.misstrendy.com.br/xml/json_produtos_busca.php',
				minLength: 3,
				loadingHtml : '<li data-icon="none"><a href="#">Pesquisando...</a></li>',
				callback: function(e){
                    var $a = $(e.currentTarget); // access the selected item
					TrocarCodigo($a.attr('href').substr(4));
				}
			});
			
			
		});
		
		
		function CargaOffline(){
			var Folder_Name = "";
			Folder_Name = "MISSTRENDY_DADOS";
				
			//Sempre pegar o primeiro elemento
			if (arrayEtapas.length > 0) {
				var link = "";
				var arquivo = arrayEtapas[0];
				var index = 0;
				arrayEtapas.splice(index, 1); //Apagar
				//Baixando os XMLs de catalogo
				if (arquivo == "xml_novidades.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos_novidades.php", Folder_Name, "xml_novidades.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_vestidos.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=1", Folder_Name, "xml_vestidos.xml");
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_saias.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=2", Folder_Name, "xml_saias.xml");
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_blusas.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=3", Folder_Name, "xml_blusas.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_casacos.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=4", Folder_Name, "xml_casacos.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_calcas.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=5", Folder_Name, "xml_calcas.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_shorts.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=6", Folder_Name, "xml_shorts.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
				if (arquivo == "xml_busca.xml"){
					try { 
						download("http://www.misstrendy.com.br/xml/json_produtos_busca_full.php", Folder_Name, "xml_busca.xml"); 
					} catch(err) {
						alert(err.message);
					}
				}
			}
			
			//ETAPA 1 - BAIXAR DADOS
			if (arrayEtapas.length === 0) {
			  if (baixar_imagens == "NAO"){
			  //alert('Carga de arquivos concluida com sucesso');
			  carregar_imagens = "";
			  $("#resultado_carga").html('Carga de arquivos concluida com sucesso');
			  //$.mobile.changePage("#lista_carga");
			  }
			}
			
			//ETAPA 2 - LISTAR IMAGENS
			if (baixar_imagens == "NAO"){
				if (carregar_imagens == ""){
				if (arrayImagens.length == 0) {	
					//alert('pc1');
					//Iterando o XML de imagens
					$.ajax({
						type: "GET",
						url: "http://www.misstrendy.com.br/xml/xml_imagens.php",
						dataType: "xml",
						success: function(data) {
							//alert('pc2');
							var contador = 0;
							$(data).find('produtos').each(function(){
								//Apenas para testes
								var nome_imagem = $(this).find("pro_imagem_nome").text();
								var imagem = $(this).find("pro_imagem_thumbs").text();
								imagem = 'http://www.misstrendy.com.br/' + imagem;
								//download(imagem, Folder_Name, nome_imagem); 
								arrayImagens.push(nome_imagem);
								contador++;
							});
							
							if (contador > 0){
								CargaOffline();
							}
							

						},
						error: function (request,error) {
							// This callback function will trigger on unsuccessful action                
							//navigator.notification.alert('Houve um erro ao buscar as informações do seu pedido!', alertDismissed, 'Miss Trendy', 'OK');
						}
					});
				}
				}
			}
			//alert("estou aqui 3"); 
		
			//ETAPA 3 - BAIXAR IMAGENS
			if (arrayImagens.length > 0) {
			  var total_imagens = arrayImagens.length;	
			  //alert('Pre-Carga de imagens concluida com sucesso. Total de imagens:' + total_imagens);
			  $("#resultado_carga").html('Pre-Carga de imagens concluida com sucesso. Total de imagens para baixar:' + total_imagens + ". Aguarde o download...");
			  baixar_imagens = "";
			  //arrayImagens = []; //Apagar array
			  //return;
			}

			if (baixar_imagens == ""){
				Folder_Name = "MISSTRENDY_IMAGENS";
				if (arrayImagens.length > 0) {
					var link = "http://www.misstrendy.com.br/thumbs/" + arrayImagens[0];
					var arquivo = arrayImagens[0];
					var index = 0;
					arrayImagens.splice(index, 1); //Apagar
					download(link, Folder_Name, arquivo);
				}
			}	
			
			//ETAPA 4 - FINALIZAR E CONFERIR
			if (baixar_imagens == ""){
				if (arrayImagens.length == 0) {
					$.mobile.changePage("#main");
				}
			}
			
		}
		
		//Funcoes para baixar arquivos
		function download(URL, Folder_Name, File_Name) {
		//step to request a file system 
		window.RequestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;  
			window.requestFileSystem(window.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

		function fileSystemSuccess(fileSystem) {
			var download_link = encodeURI(URL);
			ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

			var directoryEntry = fileSystem.root; // to get root path of directory
			directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
			var rootdir = fileSystem.root;
			//var fp = rootdir.fullPath; // Returns Fulpath of local directory
			//The latest version of Cordova (3.3+), the newer (1.0.0+) version of File uses filesystem URLs instead of the file path.
			var fp = rootdir.toURL(); 

			//fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
			fp = fp + "/" + Folder_Name + "/" + File_Name; // fullpath and name of the file which we want to give
			// download function call
			filetransfer(download_link, fp);
		}

		function onDirectorySuccess(parent) {
			// Directory created successfuly
			//alert("criou diretorio");
		}

		function onDirectoryFail(error) {
			//Error while creating directory
			alert("Unable to create new directory: " + error.code);
		}

		  function fileSystemFail(evt) {
			//Unable to access file system
			alert(evt.target.error.code);
		 }
		}
		
		
		function filetransfer(download_link, fp) {
		var fileTransfer = new FileTransfer();
		// File download function with URL and local path
		fileTransfer.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
				//carga_porcentagem.innerHTML = perc + "% loaded...";
				$("#resultado_carga2").html(perc + "% loaded...");
			} else {
				if($("#resultado_carga2").html() == "") {
					//carga_porcentagem.innerHTML = "Carregando";
					$("#resultado_carga2").html(perc + "Carregando");
				} else {
					//carga_porcentagem.innerHTML += ".";
					$("#resultado_carga2").html("....");
				}
			}
		};
		
		fileTransfer.download(download_link, fp,
							function (entry) {
								//alert("download complete: " + entry.fullPath);
								$("#resultado_carga").html("download complete: " + entry.fullPath);
								CargaOffline();
							},
						 function (error) {
							 //Download abort errors or download failed errors
							//alert("download error source " + error.source);
							$("#resultado_carga").html("download error source " + error.source);
							 //alert("download error target " + error.target);
							 //alert("upload error code" + error.code);
							 CargaOffline();
						 }
					);
		}
		
		//Conferir arquivos baixados
		$(document).on('pageshow', '#lista_carga', function(){
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				var resultados = "<p>Arquivos</p>";
				resultados = resultados + "Root = " + fs.root.fullPath + "<br>";
				//Listar Tudo
				var directoryReader = fs.root.createReader();
				directoryReader.readEntries(function(entries) {
				var i;
				for (i=0; i<entries.length; i++) {
					var objectType = "";
					if(entries[i].isDirectory == true) {
                        objectType = 'Diretorio:: ';
                    } else {
                        objectType = 'Arquivo::   ';
                    }
					resultados = resultados + objectType + entries[i].name + "<br/>";
				}
				
				
				//Imprimir na tela
				$("#main_lista_carga").append(resultados);
				}, function (error) {
				alert(error.code);
				})
				}, function (error) {
					alert(error.code);
				});
			
			//Lendo somente o diretorio de dados
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			var localFolder = "MISSTRENDY_DADOS";
			fs.root.getDirectory(localFolder, {create: false}, 
				
				function (dirEntry) {
					var resultados = "";
					resultados = resultados + "***** DADOS *****<BR>";
					var directoryReader2 = dirEntry.createReader();
					directoryReader2.readEntries(function(entries) {
					var i;
					for (i=0; i<entries.length; i++) {
						var objectType = "";
						if(entries[i].isDirectory == true) {
							objectType = 'Diretorio:: ';
						} else {
							objectType = 'Arquivo::   ';
						}
						resultados = resultados + objectType + entries[i].name + "* " + entries[i].fullPath + "<br/>";
					}
					$("#main_lista_carga").append(resultados);
				}, 
				
				function (error) {
					alert(error.code);
				}
				);
			}, 
				function (error) {
					alert(error.code);
				}
			
			);
			}, function (error) {
				alert(error.code);
			});
			
			//Lendo somente o diretorio de imagens
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			var localFolder = "MISSTRENDY_IMAGENS";
			fs.root.getDirectory(localFolder, {create: false}, 
				
				function (dirEntry) {
					var resultados = "";
					resultados = resultados + "***** IMAGENS *****<BR>";
					var directoryReader2 = dirEntry.createReader();
					directoryReader2.readEntries(function(entries) {
					var i;
					for (i=0; i<entries.length; i++) {
						var objectType = "";
						if(entries[i].isDirectory == true) {
							objectType = 'Diretorio:: ';
						} else {
							objectType = 'Arquivo::   ';
						}
						resultados = resultados + objectType + entries[i].name + " * " + entries[i].toNativeUrl + "<br/>";
					}
					$("#main_lista_carga").append(resultados);
				}, 
				
				function (error) {
					alert(error.code);
				}
				);
			}, 
				function (error) {
					alert(error.code);
				}
			
			);
			}, function (error) {
				alert(error.code);
			});
			
			alert("listagem concluida");
			
			
		});
		
		function LerArquivo_dados(nome_arquivo_dados, destino, titulo){
			carga_offline_titulo = titulo;
			carga_offline_destino = destino;
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				var localFolder = "MISSTRENDY_DADOS";
				var nome_arquivo = localFolder + "/" + nome_arquivo_dados;
				fs.root.getFile(nome_arquivo,  {create: false}, gotFileEntry, arquivo_fail);

			}, function (error) {
				alert(error.code);
			});
		}
		
		function gotFileEntry(fileEntry) {
			fileEntry.file(gotFile, arquivo_fail);
		}

		function gotFile(file){
			//readDataUrl(file);
			readAsText(file);
		}

		//Le o arquivo como base64
		function readDataUrl(file) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				arquivo_nome = evt.target.result;
			};
			reader.readAsDataURL(file);
		}

		//Le o arquivo como texto
		function readAsText(file) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				LerXML_local(evt.target.result);
				arquivo_conteudo = evt.target.result;
				
			};
			reader.readAsText(file);
		}
		
		function arquivo_fail(evt) {
			alert('fail open image')
			//alert(evt.target.error.code);
		}
		
		//Teste leitura de XML
		function LerXML_local(variavel_XML){
			xmlDoc = $.parseXML(variavel_XML);
			CarregarConteudoXML(xmlDoc, carga_offline_destino, carga_offline_titulo);
			//$xml = $(xmlDoc);
			//$xml.find('produtos').each(function(){
			//	var nome = $(this).find("pro_descricao").text();
			//});	
		}
		
		//Apagando arquivos...
		function ClearDirectory(localFolder) {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
			function fail(evt) {
				alert("FILE SYSTEM FAILURE" + evt.target.error.code);
			}
			function onFileSystemSuccess(fileSystem) {
				fileSystem.root.getDirectory(
					 localFolder,
					{create : true, exclusive : false},
					function(entry) {
					entry.removeRecursively(function() {
						console.log("Remove Recursively Succeeded");
					}, fail);
				}, fail);
			}
		}
		
		function ApagarCargaArquivos(){
			alert('iniciando limpeza de arquivos');
			$("#main_lista_carga").append("");
			ClearDirectory("MISSTRENDY_DADOS");
			ClearDirectory("MISSTRENDY_IMAGENS");
			alert('*** fim ***');
			$("#main_lista_carga").append("");
			$.mobile.changePage("#lista_carga");
		}
		
		function AbrirImagem(nome_da_imagem, destino){
			carga_offline_destino_imagem = destino;
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
				var localFolder = "MISSTRENDY_IMAGENS";
				var nome_arquivo = localFolder + "/" + nome_da_imagem;
				fs.root.getFile(nome_arquivo,  {create: false}, gotFileEntry2, arquivo_fail);

			}, function (error) {
				alert(error.code);
			});
			
		}
		
		function gotFileEntry2(fileEntry) {
			fileEntry.file(gotFile2, arquivo_fail);
		}

		function gotFile2(file){
			readDataUrl2(file);
		}

		//Le o arquivo como base64
		function readDataUrl2(file) {
			var reader = new FileReader();
			reader.onloadend = function(evt) {
				var dataURL = evt.target.result;
				//$('#imagem_exemplo').src = dataURL;
				//$('#imagem_exemplo').attr('src',  dataURL);
				$(carga_offline_destino_imagem).attr('src',  dataURL);
				CarregarImagensXML();
			};
			reader.readAsDataURL(file);
		}
		
		
		//Lendo um arquivo XML Online
		//As duas funcoes abaixo carregam as categorias
		function LerXML_Online(tipo, variavel, destino, titulo){
			var link = "";
			if (tipo== "1"){
				link = "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&q=http://feeds.folha.uol.com.br/mercado/rss091.xml&num=20";
			}
			if (tipo== "2"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos_novidades.php";
			}
			if (tipo== "3"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=1";
			}
			if (tipo== "4"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=2";
			}
			if (tipo== "5"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=3";
			}
			if (tipo== "6"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=4";
			}
			if (tipo== "7"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=5";
			}
			if (tipo== "8"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=6";
			}
			if (tipo== "9"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos_detalhe.php?codigo=" + variavel;
			}	
			if (tipo== "10"){
				link = "http://www.misstrendy.com.br/xml/xml_produtos_busca.php?busca=" + variavel;
			}
			
			$.ajax({
				type: "GET",
				url: link,
				dataType: "xml",
				success: function(data) {
					CarregarConteudoXML(data, destino, titulo);
				},
				error: function (request,error) {
					var retorno = "";
					return retorno;
				}
			});
		}
		
		function CarregarConteudoXML(dados, destino, titulo){
			var conteudo = "<h2>" + titulo + "!</h2>";
			conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input1">';
			$(dados).find('produtos').each(function(){
				var codigo = $(this).find("pro_cod").text();
				var imagem = $(this).find("pro_imagem").text();
				var imagem_nome = $(this).find("pro_imagem_nome").text();
				var nome_imagem = $(this).find("pro_imagem").text();
				var nome = $(this).find("pro_descricao").text();
				var valor = $(this).find("pro_valor").text();
				var valor_promo = $(this).find("pro_valor_promocao").text();
				imagem = 'http://www.misstrendy.com.br/' + imagem;
					
				conteudo = conteudo + '<div class="produtos">';
				conteudo = conteudo + '<div class="produtos-images">';
				
				//conteudo = conteudo + '	<a id = "' + codigo + '" data-parm="' + codigo + '"  href="tela10.html?codigo='+ codigo +'"><img id = "#img_' + codigo + '" src="' + imagem + '" width="200" height="200" class="img"></a>';		
				
				if (sistema_online == "NAO"){
					conteudo = conteudo + '	<img id = "img_' + codigo + '" src="img/no-img.jpg" width="200" height="200" class="img">';
				} else {
					//conteudo = conteudo + '	<a id = "' + codigo + '" data-parm="' + codigo + '"  href="tela10.html?codigo='+ codigo +'"><img id = "img_' + codigo + '" src="' + imagem + '" width="200" height="200" class="img"></a>';
					
					conteudo = conteudo + '	<a id = "' + codigo + '" data-parm="' + codigo + '" href="#" onclick="TrocarCodigo('+ codigo +')"><img id = "img_' + codigo + '" src="' + imagem + '" width="200" height="200" class="img"></a>';
				}
				
				conteudo = conteudo + '</div>';
				conteudo = conteudo + '<div class="produtos-tit">' + nome + '</div>';
				if (valor_promo == ""){
					conteudo = conteudo + '<div class="valor"> Valor: R$ ' + valor + '</span></div>';
				} else {
					conteudo = conteudo + '<div class="produtos-preco">';
					conteudo = conteudo + '	<span class="preco-promo">De: R$ ' + valor + '</span>';
					conteudo = conteudo + '	<br>';
					conteudo = conteudo + '	Por: R$ ' + valor_promo;   
					conteudo = conteudo + '</div>';
				}
				if (sistema_online == "NAO"){
					var dados_temporarios = [imagem_nome, "#img_" + codigo];
					tmp_arrayImagens.push(dados_temporarios);
					//AbrirImagem(imagem_nome, "#img_" + codigo);
				}
				conteudo = conteudo + '</div>';
			});
			conteudo = conteudo + '</div>';
			$(destino).html(conteudo);
			if (sistema_online == "NAO"){
				CarregarImagensXML();
			}
			
		}
		
		function CarregarImagensXML(){
			if (tmp_arrayImagens.length > 0) {	
				var dados_imagem = tmp_arrayImagens[0];
				var index = 0;
				var imagem_nome = dados_imagem[0];
				var imagem_div = dados_imagem[1];
				tmp_arrayImagens.splice(index, 1); //Apagar
				AbrirImagem(imagem_nome, imagem_div);
			}
		}
		
		function VerificarCargaArquivos(){
						//Lendo somente o diretorio de dados
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			var localFolder = "MISSTRENDY_DADOS";
			fs.root.getDirectory(localFolder, {create: false}, 
				
				function (dirEntry) {
					var resultados = "";
					resultados = resultados + "***** DADOS *****<BR>";
					var directoryReader2 = dirEntry.createReader();
					directoryReader2.readEntries(function(entries) {
					var i;
					for (i=0; i<entries.length; i++) {
						carga_dados_completa =  1;
					}
				}, 
				
				function (error) {
					//alert(error.code);
				}
				);
			}, 
				function (error) {
					//alert(error.code);
				}
			
			);
			}, function (error) {
				//alert(error.code);
			});
			
			//Lendo somente o diretorio de imagens
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
			var localFolder = "MISSTRENDY_IMAGENS";
			fs.root.getDirectory(localFolder, {create: false}, 
				
				function (dirEntry) {
					var resultados = "";
					resultados = resultados + "***** IMAGENS *****<BR>";
					var directoryReader2 = dirEntry.createReader();
					directoryReader2.readEntries(function(entries) {
					var i;
					for (i=0; i<entries.length; i++) {
						carga_imagens_completa =  1;
					}
					$("#main_lista_carga").append(resultados);
				}, 
				
				function (error) {
					//alert(error.code);
				}
				);
			}, 
				function (error) {
					//alert(error.code);
				}
			
			);
			}, function (error) {
				//alert(error.code);
			});
			
			if (carga_dados_completa ==  1) {
				if (carga_imagens_completa ==  1) {
					carga_completa =  1;
				}
			}

		}

		
		$(document).on('pageshow', '#ler_arquivo', function(){
			//AbrirImagem("ves08.jpg");
		});