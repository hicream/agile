package org.sonatype.mavenbook.web;

import java.io.*;
import java.servlet.*;
import java.servlet.http.*;

public class SimpleServlet extends HttpServlet {

  public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
    PrintWriter out = response.getWriter();
    out.println("SimpleServlet Executed");
    out.flush();
    out.close();
  }
}
