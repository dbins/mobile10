		//http://www.javascriptlint.com/online_lint.php
		var codigo_produto  = 0;
		var resultados_busca = 0;
		
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
			  }
			var continuar = true;
			var mensagem ="Ocorreram os seguintes erros:\n"
			
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
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos_novidades.php",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Novidades!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input1">';
					$(data).find('produtos').each(function(){
						var codigo = $(this).find("pro_cod").text();
						var imagem = $(this).find("pro_imagem").text();
						var nome = $(this).find("pro_descricao").text();
						var valor = $(this).find("pro_valor").text();
						var valor_promo = $(this).find("pro_valor_promocao").text();
						imagem = 'http://www.misstrendy.com.br/' + imagem;
					
						conteudo = conteudo + '<div class="produtos">';
						conteudo = conteudo + '<div class="produtos-images">';
						conteudo = conteudo + '	<a id = "' + codigo + '" data-parm="' + codigo + '"  href="tela10.html?codigo='+ codigo +'"><img src="' + imagem + '" width="200" height="200" class="img"></a>';		
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
					conteudo = conteudo + '</div>';
					$("#main_tela1").html(conteudo);

				}
			});
		});		
			
		$(document).on('pageinit', '#tela2', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=1",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Vestidos!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input2">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela2").html(conteudo);

				}
			});
		});	
		
		$(document).on('pageinit', '#tela3', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=2",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Saias!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input3">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela3").html(conteudo);

				}
			});
		});	
		
		$(document).on('pageinit', '#tela4', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=3",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Blusas!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input4">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela4").html(conteudo);

				}
			});
		});	
		
		$(document).on('pageinit', '#tela5', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=4",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Casacos!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input5">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela5").html(conteudo);

				}
			});
		});
		
		$(document).on('pageinit', '#tela6', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=5",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Calças!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input6">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela6").html(conteudo);

				}
			});
		});

		$(document).on('pageinit', '#tela7', function(){  
			
			
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos.php?categoria=6",
				dataType: "xml",
				success: function(data) {
					var conteudo = "<h2>Shorts!</h2>";
					conteudo = conteudo + '<div class="elements" data-filter="true" data-input="#divOfPs-input7">';
					$(data).find('produtos').each(function(){
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
					conteudo = conteudo + '</div>';
					$("#main_tela7").html(conteudo);
					$('[data-role="main"]').trigger('create');

				}
			});
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
				parameter = parameters.replace("codigo=","");
				alert('1');
				codigo_produto = parameter;
				alert(parameter);
			//}
			
			//codigo_produto = parameter;
			//Produto Selecionado
			$.ajax({
				type: "GET",
				url: "http://www.misstrendy.com.br/xml/xml_produtos_detalhe.php?codigo=" + codigo_produto,
				dataType: "xml",
				success: function(data) {
					var conteudo = '<header class="titulos"><span style="color:#333">Informações do </span>produto</header>';
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
						conteudo = conteudo + '	<div class="titulos"><span style="color:#333">Descrição </span></div>';
						conteudo = conteudo + '	<div class="descprod">';
						conteudo = conteudo + '		<p>' + detalhes + '</p>';
						conteudo = conteudo + '		<p><strong>Tamanho:' + tamanho + '</strong></p>';
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

		$(document).on('pageinit', '#tela11', function(){  
        $(document).on('click', '#enviar_busca', function() { 
			var field_tag_css = {
				"background-color": "#FFFF99"
			  }
			
			var continuar = true;
			var busca = "";
			var mensagem ="Ocorreram os seguintes erros:\n"
			
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
					$("#main_tela11").html(conteudo);

				}
			});
			} else {
				navigator.notification.alert(mensagem,alertDismissed, 'Miss Trendy', 'OK');
				//return false;
			}        
		});	
		});	
		
		
