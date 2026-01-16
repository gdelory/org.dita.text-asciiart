<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:saxon="http://icl.com/saxon"
                extension-element-prefixes="saxon"
                >


  <!-- Example:
  <embed-table uri="file:/C:/DITA-OT2.0PoC/temp/tasks/changingtheoil.xml_tbl1.tbl"/>
  -->
  <xsl:template match="embed-table|embed-syn" priority="20">
    <xsl:message select="concat('inserting ', @uri)"/>
    <xsl:value-of select="unparsed-text(concat(@uri,'X'), 'utf-8')"/>
  </xsl:template>
  
  <xsl:template match="block[embed-table|embed-syn]">
    <!-- Ignore lead in text, because we'll be full page -->
    <xsl:choose>
      <xsl:when test="ancestor::text">      <!-- Should not ever be active, but just in case -->
        <xsl:apply-templates select="embed-table|embed-syn"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:if test="preceding-sibling::*">
          <xsl:call-template name="force-two-newlines"/>
        </xsl:if>
        <xsl:call-template name="center-this-block"/>
        <xsl:apply-templates select="embed-table|embed-syn"/>
        <xsl:call-template name="UN-center-this-block"/>
      </xsl:otherwise>
    </xsl:choose>
    <xsl:apply-templates select="(following-sibling::*)[1]"/>
  </xsl:template>

</xsl:stylesheet>
