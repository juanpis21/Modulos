package com.clinicpet.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.clinicpet.demo.model.Evento;
import com.clinicpet.demo.repository.IEventoRepository;

@Controller
public class HomeController {

	@Autowired
	private IEventoRepository eventoRepository;

	// Mapeo para la raíz del sitio con paginación
	@GetMapping("/")
	public String home(
			@RequestParam(defaultValue = "0") int page,
			Model model) {
		
		// Configurar paginación: 6 eventos por página
		int pageSize = 6;
		Pageable pageable = PageRequest.of(page, pageSize);
		
		// Obtener página de eventos
		Page<Evento> eventosPage = eventoRepository.findAll(pageable);
		
		// Agregar atributos al modelo
		model.addAttribute("eventos", eventosPage.getContent());
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", eventosPage.getTotalPages());
		model.addAttribute("totalItems", eventosPage.getTotalElements());
		
		return "index";
	}
}
