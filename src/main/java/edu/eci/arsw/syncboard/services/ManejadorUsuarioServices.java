/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.syncboard.services;

import edu.eci.arsw.syncboard.model.Clase;
import edu.eci.arsw.syncboard.model.Correo;
import edu.eci.arsw.syncboard.model.Profesor;
import edu.eci.arsw.syncboard.model.Usuario;
import static java.util.Collections.list;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.LinkedList;

/**
 *
 * @author 2103216
 */
@Service
public class ManejadorUsuarioServices {

    List<Usuario> empl = new LinkedList<>();
    List<Usuario> estu = new LinkedList<>();
    List<Correo> correos = new LinkedList<>();
    List<Clase> clases = new LinkedList<>();


    public void RegistrarUsuario(String nombre, String tipo, long cedula_numero, String cedula_tipo, Integer carnet, String correo, String pass) {
        Usuario us = null;
        Correo email = null;
        if (tipo == "Profesor") {
            //email = new Correo(correo, cedula_numero, tipo);
            us = new Profesor(nombre, tipo, cedula_numero, cedula_tipo, carnet, correo, pass);
            email = new Correo(correo, tipo, pass);
        } else {
            //us=new Estudiante(carn, cor);
        }

        ingresoUsuario(us);
        agregarCorreo(email);
    }

    public void agregarCorreo(Correo email) {
        correos.add(email);
    }

    public void ingresoUsuario(Usuario user) {
        empl.add(user);
    }

    public List getUsuarios() {
        return empl;
    }

    public void agregarClase(Clase clase) {
        clases.add(clase);
    }

    public List getClases() {
        return clases;
    }

    public List getCorreos() {
        return correos;
    }

    public void adjuntarEstudiante(String claseActual, String userActual) {
        for (int i = 0; i < clases.size(); i++) {

            if (clases.get(i).NombreClase.equals(claseActual)) {

                clases.get(i).setEstudiantes(userActual);
            }
        }
    }

}
